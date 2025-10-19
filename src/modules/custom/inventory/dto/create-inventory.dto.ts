import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({ example: 'Paracetamol 500mg' })
  itemName: string;

  @ApiProperty({ example: 'Medication' })
  category: string;

  @ApiProperty({ example: 100 })
  quantity: number;

  @ApiProperty({ example: 2.50 })
  unitPrice: number;

  @ApiProperty({ example: 'PharmaCorp Ltd', required: false })
  supplier?: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  expirationDate?: string;
}