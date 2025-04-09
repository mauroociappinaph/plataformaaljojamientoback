import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Booking, BookingStatus, PaymentStatus } from '@prisma/client';
import { CreateBookingDto, UpdateBookingDto, FilterBookingDto } from './dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    // Verificar que la propiedad existe
    const property = await this.prisma.property.findUnique({
      where: { id: createBookingDto.propertyId },
    });

    if (!property) {
      throw new NotFoundException(`La propiedad con ID ${createBookingDto.propertyId} no existe`);
    }

    // Verificar disponibilidad de fechas
    const overlappingBookings = await this.prisma.booking.findFirst({
      where: {
        propertyId: createBookingDto.propertyId,
        OR: [
          {
            AND: [
              { startDate: { lte: createBookingDto.startDate } },
              { endDate: { gte: createBookingDto.startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: createBookingDto.endDate } },
              { endDate: { gte: createBookingDto.endDate } },
            ],
          },
          {
            AND: [
              { startDate: { gte: createBookingDto.startDate } },
              { endDate: { lte: createBookingDto.endDate } },
            ],
          },
        ],
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
    });

    if (overlappingBookings) {
      throw new BadRequestException('La propiedad no está disponible en las fechas seleccionadas');
    }

    // Validar que la fecha de inicio es anterior a la fecha de fin
    if (new Date(createBookingDto.startDate) >= new Date(createBookingDto.endDate)) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    // Validar que la fecha de inicio es en el futuro
    if (new Date(createBookingDto.startDate) < new Date()) {
      throw new BadRequestException('La fecha de inicio debe ser en el futuro');
    }

    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        userId,
        status: createBookingDto.status || BookingStatus.PENDING,
        paymentStatus: createBookingDto.paymentStatus || PaymentStatus.PENDING,
      },
    });
  }

  async findAll(filters: FilterBookingDto): Promise<Booking[]> {
    const where: any = {};

    if (filters.propertyId) where.propertyId = filters.propertyId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.startDate) where.startDate = { gte: filters.startDate };
    if (filters.endDate) where.endDate = { lte: filters.endDate };

    return this.prisma.booking.findMany({
      where,
      include: {
        property: {
          include: {
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        messages: true,
        review: true,
      },
    });
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            category: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        messages: true,
        review: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`La reserva con ID ${id} no existe`);
    }

    return booking;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByPropertyId(propertyId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { propertyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, userId: string): Promise<Booking> {
    // Verificar que la reserva existe
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`La reserva con ID ${id} no existe`);
    }

    // Verificar que el usuario tiene permisos para actualizar la reserva
    if (booking.userId !== userId && booking.property.ownerId !== userId) {
      throw new ForbiddenException('No tienes permisos para actualizar esta reserva');
    }

    // Si se están actualizando las fechas, verificar disponibilidad
    if (updateBookingDto.startDate || updateBookingDto.endDate) {
      const startDate = updateBookingDto.startDate || booking.startDate;
      const endDate = updateBookingDto.endDate || booking.endDate;

      const overlappingBookings = await this.prisma.booking.findFirst({
        where: {
          id: { not: id },
          propertyId: booking.propertyId,
          OR: [
            {
              AND: [
                { startDate: { lte: startDate } },
                { endDate: { gte: startDate } },
              ],
            },
            {
              AND: [
                { startDate: { lte: endDate } },
                { endDate: { gte: endDate } },
              ],
            },
            {
              AND: [
                { startDate: { gte: startDate } },
                { endDate: { lte: endDate } },
              ],
            },
          ],
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
        },
      });

      if (overlappingBookings) {
        throw new BadRequestException('La propiedad no está disponible en las fechas seleccionadas');
      }

      // Validar que la fecha de inicio es anterior a la fecha de fin
      if (new Date(startDate) >= new Date(endDate)) {
        throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
      }
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      include: {
        property: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: BookingStatus, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`La reserva con ID ${id} no existe`);
    }

    // Verificar que el usuario tiene permisos para actualizar el estado
    // Solo el propietario puede confirmar o rechazar una reserva
    // Solo el usuario que hizo la reserva puede cancelarla
    if (status === BookingStatus.CONFIRMED || status === BookingStatus.CANCELLED) {
      if (booking.property.ownerId !== userId && status === BookingStatus.CONFIRMED) {
        throw new ForbiddenException('Solo el propietario puede confirmar una reserva');
      }

      if (booking.userId !== userId && status === BookingStatus.CANCELLED) {
        throw new ForbiddenException('Solo el usuario que realizó la reserva puede cancelarla');
      }
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        property: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`La reserva con ID ${id} no existe`);
    }

    return this.prisma.booking.update({
      where: { id },
      data: { paymentStatus },
    });
  }

  async remove(id: string, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`La reserva con ID ${id} no existe`);
    }

    // Verificar que el usuario tiene permisos para eliminar la reserva
    if (booking.userId !== userId && booking.property.ownerId !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar esta reserva');
    }

    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
