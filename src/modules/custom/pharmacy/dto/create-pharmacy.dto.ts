import { ApiProperty } from '@nestjs/swagger';

export class CreatePharmacyDto {
  @ApiProperty({ example: 'Amoxicillin' })
  medicationName: string;

  @ApiProperty({ example: '500mg twice daily' })
  dosage: string;

  @ApiProperty({ example: 30 })
  quantity: number;

  @ApiProperty({ example: 'pat_123' })
  patientId: string;

  @ApiProperty({ example: 'doc_456' })
  prescriberId: string;
}