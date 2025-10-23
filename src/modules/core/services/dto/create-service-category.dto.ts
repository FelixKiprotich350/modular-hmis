import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceCategoryDto {
  @ApiProperty({ description: 'Service category name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Service category code' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'Service category description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Service category active status', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateServiceCategoryDto {
  @ApiPropertyOptional({ description: 'Service category name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Service category description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Service category active status' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}