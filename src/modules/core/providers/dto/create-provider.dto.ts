import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty({ example: 'John' })
  firstName: string;
  
  @ApiProperty({ example: 'Smith' })
  lastName: string;
  
  @ApiProperty({ required: false, example: 'Michael' })
  middleName?: string;
  
  @ApiProperty({ enum: ['M', 'F', 'O'] })
  gender: string;
  
  @ApiProperty({ required: false })
  birthdate?: Date;
  
  @ApiProperty({ required: false, example: '+1234567890' })
  phone?: string;
  
  @ApiProperty({ required: false, example: 'john.smith@hospital.com' })
  email?: string;
  
  @ApiProperty({ required: false, example: 'DOC001' })
  identifier?: string;
}