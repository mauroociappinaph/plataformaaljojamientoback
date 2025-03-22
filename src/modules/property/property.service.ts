import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Property } from '@prisma/client';
import { PropertyRepository } from './repositories/property-repository.interface';
import { CreatePropertyDto, UpdatePropertyDto, FilterPropertyDto } from './dto';

@Injectable()
export class PropertyService {
  constructor(
    @Inject('PropertyRepository')
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, ownerId: string): Promise<Property> {
    return this.propertyRepository.create(createPropertyDto, ownerId);
  }

  async findAll(filters: FilterPropertyDto): Promise<{ data: Property[]; total: number }> {
    return this.propertyRepository.findAll(filters);
  }

  async findById(id: string): Promise<Property> {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new NotFoundException(`Propiedad con ID ${id} no encontrada`);
    }
    return property;
  }

  async findByOwnerId(ownerId: string): Promise<Property[]> {
    return this.propertyRepository.findByOwnerId(ownerId);
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    return this.propertyRepository.update(id, updatePropertyDto);
  }

  async remove(id: string): Promise<Property> {
    return this.propertyRepository.remove(id);
  }
}
