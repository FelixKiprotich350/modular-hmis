import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateServiceDto {
  @ApiProperty({ description: "Service name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Service code" })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: "Service description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Service category ID" })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ description: "Service duration in minutes" })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ description: "Service price" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: "Service active status", default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: "Service name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Service description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "Service category ID" })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: "Service duration in minutes" })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ description: "Service price" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: "Service active status" })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
