import { ApiProperty } from '@nestjs/swagger';

export class CreateIdentifierTypeDto {
  @ApiProperty({ example: 'National ID' })
  name: string;
  
  @ApiProperty({ required: false, example: 'National identification number' })
  description?: string;
  
  @ApiProperty({ required: false, example: 'NNNNNNNN' })
  format?: string;
  
  @ApiProperty({ default: false })
  required: boolean = false;
  
  @ApiProperty({ default: false })
  checkDigit: boolean = false;
  
  @ApiProperty({ default: false })
  retired: boolean = false;
}