import { PartialType } from '@nestjs/swagger';
import { CreatePatientProfileDto } from './create-patient-profile.dto';

export class UpdateFamilyPatientProfileDto extends PartialType(
  CreatePatientProfileDto,
) {}
