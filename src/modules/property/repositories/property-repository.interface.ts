import { Property } from '@prisma/client';
import { CreatePropertyDto, UpdatePropertyDto, FilterPropertyDto } from '../dto';

/**
 * Interfaz para el repositorio de propiedades
 */
export interface PropertyRepository {
  /**
   * Crear una nueva propiedad
   */
  create(data: CreatePropertyDto, ownerId: string): Promise<Property>;

  /**
   * Encontrar una propiedad por ID
   */
  findById(id: string): Promise<Property | null>;

  /**
   * Encontrar todas las propiedades con filtros opcionales
   */
  findAll(filters: FilterPropertyDto): Promise<{ data: Property[]; total: number }>;

  /**
   * Encontrar propiedades por ID del propietario
   */
  findByOwnerId(ownerId: string): Promise<Property[]>;

  /**
   * Actualizar una propiedad
   */
  update(id: string, data: UpdatePropertyDto): Promise<Property>;

  /**
   * Eliminar una propiedad
   */
  remove(id: string): Promise<Property>;
}
