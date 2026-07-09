import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('hospitals')
  async findHospitals() {
    return this.bookingService.findHospitals();
  }

  @Get('specialties')
  async findSpecialties(@Query('hospitalId', ParseIntPipe) hospitalId: number) {
    return this.bookingService.findSpecialties(hospitalId);
  }

  @Get('doctors')
  async findDoctors(
    @Query('hospitalId', ParseIntPipe) hospitalId: number,
    @Query('specialtyId') specialtyId: string,
  ) {
    return this.bookingService.findDoctors(hospitalId, specialtyId);
  }

  @Get('time-slots')
  async findTimeSlots(
    @Query('doctorId', ParseIntPipe) doctorId: number,
    @Query('date') date: string,
  ) {
    return this.bookingService.findTimeSlots(doctorId, date);
  }
}
