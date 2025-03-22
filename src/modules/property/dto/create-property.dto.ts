import { IsString, IsNumber, IsArray, IsNotEmpty, Min, IsUUID, IsOptional } from 'class-validator';

/**
 * DTO para la creación de una propiedad
 */
export class CreatePropertyDto {
  /**
   * Título de la propiedad
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Descripción detallada de la propiedad
   */
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Precio por noche
   */
  @IsNumber()
  @Min(0)
  price: number;

  /**
   * Ubicación general (ej: "Centro de la ciudad")
   */
  @IsString()
  @IsNotEmpty()
  location: string;

  /**
   * Dirección completa
   */
  @IsString()
  @IsNotEmpty()
  address: string;

  /**
   * Ciudad
   */
  @IsString()
  @IsNotEmpty()
  city: string;

  /**
   * País
   */
  @IsString()
  @IsNotEmpty()
  country: string;

  /**
   * Lista de amenidades/comodidades
   */
  @IsArray()
  amenities: string[];

  /**
   * URLs de las imágenes
   */
  @IsArray()
  @IsOptional()
  images?: string[];

  /**
   * Número de baños
   */
  @IsNumber()
  @Min(0)
  bathrooms: number;

  /**
   * Número de dormitorios
   */
  @IsNumber()
  @Min(0)
  bedrooms: number;

  /**
   * Número máximo de huéspedes
   */
  @IsNumber()
  @Min(1)
  maxGuests: number;

  /**
   * ID de la categoría
   */
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
