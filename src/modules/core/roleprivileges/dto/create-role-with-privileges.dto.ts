import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleWithPrivilegesDto {
  @ApiProperty({ example: 'Nurse' })
  name: string;

  @ApiProperty({ example: ['priv_1', 'priv_2'] })
  privilegeIds: string[];
}