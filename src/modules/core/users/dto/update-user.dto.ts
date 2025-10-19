import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe_updated', required: false })
  username?: string;

  @ApiProperty({ example: 'john.updated@example.com', required: false })
  email?: string;
}