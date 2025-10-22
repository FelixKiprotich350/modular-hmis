import { ApiProperty } from '@nestjs/swagger';

export class CreateConceptDto {
  @ApiProperty({ example: 'Weight' })
  name: string;
  
  @ApiProperty({ enum: ['Text', 'Numeric', 'Coded', 'Date', 'Boolean', 'Complex'] })
  datatype: 'Text' | 'Numeric' | 'Coded' | 'Date' | 'Boolean' | 'Complex';
  
  @ApiProperty({ required: false, example: 'Misc' })
  conceptClass?: string;
  
  @ApiProperty({ required: false, example: 'Patient body weight' })
  description?: string;
  
  @ApiProperty({ required: false, example: 'kg' })
  units?: string;
  
  @ApiProperty({ required: false, default: false })
  retired?: boolean = false;
}