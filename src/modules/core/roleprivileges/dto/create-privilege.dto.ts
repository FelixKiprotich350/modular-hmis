import { ApiProperty } from '@nestjs/swagger';

export class CreatePrivilegeDto {
  @ApiProperty({ example: 'view_patients' })
  name: string;
}