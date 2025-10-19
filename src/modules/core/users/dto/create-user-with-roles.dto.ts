import { ApiProperty } from '@nestjs/swagger';

export class CreateUserWithRolesDto {
  @ApiProperty({ example: 'jane_doe' })
  username: string;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: ['user', 'admin'] })
  roles: string[];
}