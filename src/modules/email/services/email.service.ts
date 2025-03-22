import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private testAccount: any = null;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    // Si estamos en producción, usar configuración real
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST'),
        port: this.configService.get<number>('EMAIL_PORT'),
        secure: this.configService.get<boolean>('EMAIL_SECURE'),
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
      });
      this.logger.log('Transporter configurado en modo producción');
    } else {
      // En desarrollo, usar Ethereal para testing
      try {
        // Crear cuenta de prueba en Ethereal
        this.testAccount = await nodemailer.createTestAccount();

        // Crear transporter con la cuenta de prueba
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true para puerto 465, false para otros puertos
          auth: {
            user: this.testAccount.user,
            pass: this.testAccount.pass,
          },
        });

        this.logger.log('===========================================');
        this.logger.log('📧 MODO DE PRUEBA DE EMAIL ACTIVO (ETHEREAL)');
        this.logger.log(`📧 Usuario: ${this.testAccount.user}`);
        this.logger.log(`📧 Contraseña: ${this.testAccount.pass}`);
        this.logger.log(`📧 Puedes acceder a todos los correos enviados en: https://ethereal.email/login`);
        this.logger.log('===========================================');
      } catch (error) {
        this.logger.error(`Error al crear cuenta de prueba Ethereal: ${error.message}`);
        // Fallback a la configuración normal
        this.transporter = nodemailer.createTransport({
          host: this.configService.get<string>('EMAIL_HOST'),
          port: this.configService.get<number>('EMAIL_PORT'),
          secure: this.configService.get<boolean>('EMAIL_SECURE'),
          auth: {
            user: this.configService.get<string>('EMAIL_USER'),
            pass: this.configService.get<string>('EMAIL_PASSWORD'),
          },
        });
      }
    }
  }

  /**
   * Envía un correo electrónico
   */
  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${this.configService.get<string>('EMAIL_FROM_NAME') || 'Plataforma Alojamiento'}" <${this.configService.get<string>('EMAIL_FROM') || 'noreply@example.com'}>`,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado a ${to}`);

      // Si estamos en modo desarrollo, mostrar URL de previsualización
      if (this.configService.get<string>('NODE_ENV') !== 'production' && this.testAccount) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('\n');
        console.log('===========================================');
        console.log('📧 EMAIL ENVIADO CORRECTAMENTE');
        console.log(`📧 Para: ${to}`);
        console.log(`📧 Asunto: ${subject}`);
        console.log(`📧 Para ver el correo enviado, visita:`);
        console.log(`📧 ${previewUrl}`);
        console.log('===========================================');
        console.log('\n');
      }

      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email a ${to}: ${error.message}`);
      return false;
    }
  }

  /**
   * Envía un correo electrónico de recuperación de contraseña
   */
  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
  ): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const subject = 'Recuperación de contraseña - Plataforma Alojamiento Vacacional';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4C7A53; text-align: center;">Recuperación de Contraseña</h2>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no has sido tú, puedes ignorar este correo.</p>
        <p>Para establecer una nueva contraseña, haz clic en el siguiente botón:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #8DD3B6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Restablecer Contraseña</a>
        </div>
        <p>O copia y pega el siguiente enlace en tu navegador:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${resetUrl}</p>
        <p>Este enlace expirará en 1 hora por razones de seguridad.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">© ${new Date().getFullYear()} Plataforma Alojamiento Vacacional. Todos los derechos reservados.</p>
      </div>
    `;

    return this.sendEmail(to, subject, html);
  }

  /**
   * Envía un email de verificación
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email/${token}`;

    await this.transporter.sendMail({
      to: email,
      subject: 'Verifica tu email - Alojamiento Vacacional',
      html: `
        <h1>Verifica tu email</h1>
        <p>Haz clic en el siguiente enlace para verificar tu dirección de email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>Este enlace expirará en 24 horas.</p>
        <p>Si no solicitaste esta verificación, puedes ignorar este email.</p>
      `
    });
  }
}
