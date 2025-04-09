import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
  ParseEnumPipe
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto, FilterBookingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingStatus, PaymentStatus } from '@prisma/client';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingService.create(createBookingDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() filters: FilterBookingDto) {
    return this.bookingService.findAll(filters);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  findMyBookings(@Request() req) {
    return this.bookingService.findByUserId(req.user.userId);
  }

  @Get('property/:propertyId')
  @UseGuards(JwtAuthGuard)
  findByProperty(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.bookingService.findByPropertyId(propertyId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req
  ) {
    return this.bookingService.update(id, updateBookingDto, req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status', new ParseEnumPipe(BookingStatus)) status: BookingStatus,
    @Request() req
  ) {
    return this.bookingService.updateStatus(id, status, req.user.userId);
  }

  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard)
  updatePaymentStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('paymentStatus', new ParseEnumPipe(PaymentStatus)) paymentStatus: PaymentStatus
  ) {
    return this.bookingService.updatePaymentStatus(id, paymentStatus);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.bookingService.remove(id, req.user.userId);
  }
}
