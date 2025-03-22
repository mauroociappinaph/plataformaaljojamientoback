import { IsString, IsNumber, IsOptional, Min, Max, IsUUID, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para filtrar propiedades en búsquedas
 */
export class FilterPropertyDto {
  /**
   * Término de búsqueda general (buscará en título, descripción, ubicación)
   */
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Filtrar por ciudad
   */
  @IsOptional()
  @IsString()
  city?: string;

  /**
   * Filtrar por país
   */
  @IsOptional()
  @IsString()
  country?: string;

  /**
   * Filtrar por categoría
   */
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  /**
   * Número mínimo de huéspedes
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  minGuests?: number;

  /**
   * Precio mínimo por noche
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  /**
   * Precio máximo por noche
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  /**
   * Número mínimo de habitaciones
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minBedrooms?: number;

  /**
   * Número mínimo de baños
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minBathrooms?: number;

  /**
   * Amenidades que debe tener la propiedad
   */
  @IsOptional()
  @IsArray()
  amenities?: string[];

  /**
   * Página para paginación (empieza en 1)
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  /**
   * Límite de resultados por página
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 10;
}
