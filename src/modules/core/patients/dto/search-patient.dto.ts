import { ApiProperty } from '@nestjs/swagger';

export class SearchPatientDto {
  @ApiProperty({ required: false, description: 'Patient name to search' })
  name?: string;
  
  @ApiProperty({ required: false, description: 'Patient identifier to search' })
  identifier?: string;
  
  @ApiProperty({ required: false, description: 'Phone number to search' })
  phone?: string;
  
  @ApiProperty({ required: false, enum: ['M', 'F', 'O'], description: 'Gender filter' })
  gender?: string;
  
  @ApiProperty({ required: false, description: 'Birth date filter' })
  birthdate?: Date;
  
  @ApiProperty({ required: false, default: 20, description: 'Number of results to return' })
  limit?: number = 20;
  
  @ApiProperty({ required: false, default: 0, description: 'Number of results to skip' })
  offset?: number = 0;
}