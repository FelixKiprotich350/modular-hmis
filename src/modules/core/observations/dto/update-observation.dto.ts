import { ApiProperty } from '@nestjs/swagger';

export class UpdateObservationDto {
  @ApiProperty({ example: '71.0', required: false })
  value?: string;

  @ApiProperty({ example: 'kg', required: false })
  units?: string;

  @ApiProperty({ example: 'Updated weight measurement', required: false })
  notes?: string;
}