import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepartmentDto {
  @ApiProperty({ required: false, example: 'Emergency Department' })
  name?: string;

  @ApiProperty({ required: false, example: 'Emergency and trauma care' })
  description?: string;
}

export class UpdateServicePointDto {
  @ApiProperty({ required: false, example: 'Consultation Room 1' })
  name?: string;

  @ApiProperty({ required: false, example: 'Primary consultation room' })
  description?: string;

  @ApiProperty({ required: false, enum: ['consultation', 'pharmacy', 'lab', 'radiology', 'procedure'], example: 'consultation' })
  serviceType?: string;
}