import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/services/email.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from '../email/dto/forgot-password.dto';
import { ResetPasswordDto } from '../email/dto/reset-password.dto';
import { VerifyEmailDto } from '../email/dto/verify-email.dto';
import { ResendVerificationDto } from '../email/dto/resend-verification.dto';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
        emailVerified: false, // Aseguramos que el usuario comience sin verificar
      },
    });

    // Generar token de verificación
    const verificationToken = this.jwtService.sign(
      { email: user.email },
      {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
        expiresIn: '24h'
      }
    );

    // Enviar email de verificación
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    const { password, ...result } = user;
    return result;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Genera un token único para la recuperación de contraseña
   */
  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Maneja la solicitud de recuperación de contraseña
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    // Siempre devolver éxito aunque el usuario no exista (por seguridad)
    if (!user) {
      return { message: 'Si el email está registrado, recibirás un correo con instrucciones' };
    }

    // Generar token de recuperación
    const resetToken = this.generateResetToken();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token válido por 1 hora

    // Almacenar el token y la fecha de expiración en la base de datos
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpiry,
      },
    });

    // Enviar email con el token de recuperación
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Si el email está registrado, recibirás un correo con instrucciones' };
  }

  /**
   * Restablecer la contraseña usando un token
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: resetPasswordDto.token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Token inválido o expirado');
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);

    // Actualizar la contraseña y eliminar el token de recuperación
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  /**
   * Verifica el email de un usuario usando un token
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      // Decodificar el token para obtener el email
      const decoded = this.jwtService.verify(verifyEmailDto.token, {
        secret: this.configService.get('JWT_VERIFICATION_SECRET')
      });

      // Buscar el usuario
      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email }
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      if (user.emailVerified) {
        throw new BadRequestException('El email ya está verificado');
      }

      // Actualizar el usuario
      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true }
      });

      return { message: 'Email verificado correctamente' };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('El token de verificación ha expirado');
      }
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Token de verificación inválido');
      }
      throw error;
    }
  }

  /**
   * Reenvía el email de verificación
   */
  async resendVerificationEmail(resendVerificationDto: ResendVerificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resendVerificationDto.email }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.emailVerified) {
      throw new BadRequestException('El email ya está verificado');
    }

    // Generar nuevo token de verificación
    const verificationToken = this.jwtService.sign(
      { email: user.email },
      {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
        expiresIn: '24h'
      }
    );

    // Enviar email de verificación
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'Email de verificación enviado correctamente' };
  }
}
