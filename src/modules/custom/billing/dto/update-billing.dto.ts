import { ApiProperty } from '@nestjs/swagger';

export class UpdateBillingDto {
  @ApiProperty({ example: 'CONSULT_002', required: false })
  serviceCode?: string;

  @ApiProperty({ example: 175.00, required: false })
  amount?: number;

  @ApiProperty({ example: 'Updated consultation', required: false })
  description?: string;

  @ApiProperty({ example: 'paid', enum: ['pending', 'paid', 'cancelled'], required: false })
  status?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  paymentDate?: string;
}