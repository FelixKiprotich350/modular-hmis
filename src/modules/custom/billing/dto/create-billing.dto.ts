import { ApiProperty } from '@nestjs/swagger';

export class CreateBillingDto {
  @ApiProperty({ example: 'pat_123' })
  patientId: string;

  @ApiProperty({ example: 'CONSULT_001' })
  serviceCode: string;

  @ApiProperty({ example: 150.00 })
  amount: number;

  @ApiProperty({ example: 'General consultation', required: false })
  description?: string;

  @ApiProperty({ example: 'ins_456', required: false })
  insuranceId?: string;
}