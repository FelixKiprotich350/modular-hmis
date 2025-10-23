import { ApiProperty } from '@nestjs/swagger';

export class CreateQueueEntryDto {
  @ApiProperty({ example: 'patient-uuid' })
  patientId: string;

  @ApiProperty({ required: false, example: 'provider-uuid' })
  providerId?: string;

  @ApiProperty({ required: false, example: 'service-point-uuid' })
  servicePointId?: string;

  @ApiProperty({ enum: ['triage', 'consultation', 'pharmacy', 'lab', 'radiology', 'procedure'], example: 'consultation' })
  queueType: string;

  @ApiProperty({ enum: [1, 2, 3, 4], example: 2, description: '1=low, 2=medium, 3=high, 4=emergency' })
  priority?: number;

  @ApiProperty({ required: false, example: 'Patient needs urgent attention' })
  notes?: string;

  @ApiProperty({ required: false, example: 30, description: 'Estimated wait time in minutes' })
  estimatedWaitTime?: number;
}

export class UpdateQueueEntryDto {
  @ApiProperty({ required: false, enum: ['waiting', 'in_progress', 'completed', 'cancelled'] })
  status?: string;

  @ApiProperty({ required: false })
  providerId?: string;

  @ApiProperty({ required: false })
  priority?: number;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  estimatedWaitTime?: number;
}