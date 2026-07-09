import { Controller, Get } from '@nestjs/common';

import { DoctorService, SpecialtySummary } from './doctors.service';

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async index(): Promise<SpecialtySummary[]> {
    return this.doctorService.findSpecialties();
  }
}
