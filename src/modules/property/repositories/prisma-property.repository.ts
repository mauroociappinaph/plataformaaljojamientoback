import { Injectable, NotFoundException } from '@nestjs/common';
import { Property, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PropertyRepository } from './property-repository.interface';
import { CreatePropertyDto, UpdatePropertyDto, FilterPropertyDto } from '../dto';

@Injectable()
export class PrismaPropertyRepository implements PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePropertyDto, ownerId: string): Promise<Property> {
    const { categoryId, ...propertyData } = data;

    // Verificar que ownerId no sea undefined
    if (!ownerId) {
      throw new Error('ownerId no puede ser undefined');
    }

    return this.prisma.property.create({
      data: {
        ...propertyData,
        owner: {
          connect: { id: ownerId }
        },
        category: {
          connect: { id: categoryId }
        }
      },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async findById(id: string): Promise<Property | null> {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
      },
    });

    return property;
  }

  async findAll(filters: FilterPropertyDto): Promise<{ data: Property[]; total: number }> {
    const {
      search,
      city,
      country,
      categoryId,
      minGuests,
      minPrice,
      maxPrice,
      minBedrooms,
      minBathrooms,
      amenities,
      page = 1,
      limit = 10
    } = filters;

    // Construir el where para filtros
    const where: Prisma.PropertyWhereInput = {};

    // Búsqueda por texto
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtros específicos
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };
    if (categoryId) where.categoryId = categoryId;
    if (minGuests) where.maxGuests = { gte: minGuests };

    // Construir el filtro de precio
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    if (minBedrooms) where.bedrooms = { gte: minBedrooms };
    if (minBathrooms) where.bathrooms = { gte: minBathrooms };

    // Filtrar por amenidades
    if (amenities && amenities.length > 0) {
      where.amenities = { hasEvery: amenities };
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Consultar propiedades y conteo total
    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.property.count({ where }),
    ]);

    return { data, total };
  }

  async findByOwnerId(ownerId: string): Promise<Property[]> {
    return this.prisma.property.findMany({
      where: { ownerId },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdatePropertyDto): Promise<Property> {
    try {
      return await this.prisma.property.update({
        where: { id },
        data,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          category: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Propiedad con ID ${id} no encontrada`);
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Property> {
    try {
      return await this.prisma.property.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Propiedad con ID ${id} no encontrada`);
        }
      }
      throw error;
    }
  }
}
