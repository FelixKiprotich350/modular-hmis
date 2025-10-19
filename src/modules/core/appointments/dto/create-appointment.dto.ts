import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'pat_123' })
  patientId: string;

  @ApiProperty({ example: 'doc_456' })
  providerId: string;

  @ApiProperty({ example: '2024-02-15' })
  appointmentDate: string;

  @ApiProperty({ example: '14:30' })
  appointmentTime: string;

  @ApiProperty({ example: 'Regular checkup', required: false })
  reason?: string;
}