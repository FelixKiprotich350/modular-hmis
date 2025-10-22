import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty({ example: 'John' })
  firstName: string;
  
  @ApiProperty({ example: 'Smith' })
  lastName: string;
  
  @ApiProperty({ required: false, example: 'Michael' })
  middleName?: string;
  
  @ApiProperty({ enum: ['M', 'F', 'U', 'O'] })
  sex: 'M' | 'F' | 'U' | 'O';
  
  @ApiProperty({ enum: ['Man', 'Woman', 'Transgender'] })
  gender: 'Man' | 'Woman' | 'Transgender';
  
  @ApiProperty({ required: false })
  birthdate?: Date;
  
  @ApiProperty({ required: false, example: '+1234567890' })
  phone?: string;
  
  @ApiProperty({ required: false, example: 'john.smith@hospital.com' })
  email?: string;
  
  @ApiProperty({ required: false, example: 'DOC001' })
  identifier?: string;
}