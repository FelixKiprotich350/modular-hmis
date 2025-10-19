import { ApiProperty } from '@nestjs/swagger';

export class UpdateInventoryDto {
  @ApiProperty({ example: 'Paracetamol 500mg', required: false })
  itemName?: string;

  @ApiProperty({ example: 'Medication', required: false })
  category?: string;

  @ApiProperty({ example: 150, required: false })
  quantity?: number;

  @ApiProperty({ example: 2.75, required: false })
  unitPrice?: number;

  @ApiProperty({ example: 'PharmaCorp Ltd', required: false })
  supplier?: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  expirationDate?: string;
}