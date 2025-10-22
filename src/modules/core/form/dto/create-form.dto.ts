import { ApiProperty } from '@nestjs/swagger';

export class CreateFormDto {
  @ApiProperty({ example: 'Patient Registration Form' })
  name: string;
  
  @ApiProperty({ example: '1.0' })
  version: string;
  
  @ApiProperty({ required: false, example: 'Form for patient registration' })
  description?: string;
  
  @ApiProperty({ required: false, example: 'REGISTRATION' })
  encounterType?: string;
  
  @ApiProperty({ required: false, default: false })
  published?: boolean = false;
  
  @ApiProperty({ required: false, default: false })
  retired?: boolean = false;
}