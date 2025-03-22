import { IsString, IsNumber, IsArray, IsNotEmpty, Min, IsUUID, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';

/**
 * DTO para actualizar una propiedad
 * Extiende de CreatePropertyDto pero hace todos los campos opcionales
 */
export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}
