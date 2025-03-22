import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO para solicitar la recuperación de contraseña
 */
export class ForgotPasswordDto {
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;
}
