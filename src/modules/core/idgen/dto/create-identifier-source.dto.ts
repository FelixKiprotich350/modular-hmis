import { ApiProperty } from '@nestjs/swagger';

export class CreateIdentifierSourceDto {
  @ApiProperty({ example: 'Patient ID Generator' })
  name: string;
  
  @ApiProperty({ required: false, example: 'Generates patient identifiers' })
  description?: string;
  
  @ApiProperty({ example: 'identifier-type-uuid' })
  identifierType: string;
  
  @ApiProperty({ required: false, example: '0123456789ABCDEF' })
  baseCharacterSet?: string;
  
  @ApiProperty({ required: false, example: 'P' })
  prefix?: string;
  
  @ApiProperty({ required: false, example: '-2024' })
  suffix?: string;
  
  @ApiProperty({ required: false, example: '000001' })
  firstIdentifierBase?: string;
  
  @ApiProperty({ required: false, example: 6 })
  minLength?: number;
  
  @ApiProperty({ required: false, example: 10 })
  maxLength?: number;
  
  @ApiProperty({ default: false })
  retired: boolean = false;
}