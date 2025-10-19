import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiProperty({ example: '2024-02-16', required: false })
  appointmentDate?: string;

  @ApiProperty({ example: '15:00', required: false })
  appointmentTime?: string;

  @ApiProperty({ example: 'Follow-up consultation', required: false })
  reason?: string;

  @ApiProperty({ example: 'confirmed', enum: ['scheduled', 'confirmed', 'cancelled', 'completed'], required: false })
  status?: string;
}