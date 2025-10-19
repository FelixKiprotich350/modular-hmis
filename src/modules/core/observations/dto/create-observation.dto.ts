import { ApiProperty } from '@nestjs/swagger';

export class CreateObservationDto {
  @ApiProperty({ example: 'pat_123' })
  patientId: string;

  @ApiProperty({ example: 'weight' })
  conceptId: string;

  @ApiProperty({ example: '70.5' })
  value: string;

  @ApiProperty({ example: 'kg', required: false })
  units?: string;

  @ApiProperty({ example: 'Patient weight measured during routine checkup', required: false })
  notes?: string;
}