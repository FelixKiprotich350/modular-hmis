import { ApiProperty } from '@nestjs/swagger';

export class UpdatePharmacyDto {
  @ApiProperty({ example: '250mg twice daily', required: false })
  dosage?: string;

  @ApiProperty({ example: 20, required: false })
  quantity?: number;

  @ApiProperty({ example: 'dispensed', enum: ['pending', 'dispensed', 'cancelled'], required: false })
  status?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  dispensedDate?: string;
}