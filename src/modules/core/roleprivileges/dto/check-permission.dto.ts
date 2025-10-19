import { ApiProperty } from '@nestjs/swagger';

export class CheckPermissionDto {
  @ApiProperty({ example: 'user_123' })
  userId: string;

  @ApiProperty({ example: 'view_patients' })
  privilegeName: string;
}