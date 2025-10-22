import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: '1990-01-01' })
  dateOfBirth: string;

  @ApiProperty({ enum: ['M', 'F', 'U', 'O'] })
  sex: 'M' | 'F' | 'U' | 'O';
  
  @ApiProperty({ enum: ['Man', 'Woman', 'Transgender'] })
  gender: 'Man' | 'Woman' | 'Transgender';

  @ApiProperty({ example: '+1234567890', required: false })
  phone?: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  email?: string;
}