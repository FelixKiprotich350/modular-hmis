import { ApiProperty } from '@nestjs/swagger';

export class ApiError {
  @ApiProperty({ example: 'id' })
  field: string;

  @ApiProperty({ example: 'Must be a valid UUID.' })
  message: string;

  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code: string;
}

export class ApiMeta {
  @ApiProperty({ example: 'req_c1a34f3b92' })
  requestId: string;

  @ApiProperty({ example: 4937 })
  durationMs: number;

  @ApiProperty({ required: false, example: 1 })
  page?: number;

  @ApiProperty({ required: false, example: 10 })
  limit?: number;

  @ApiProperty({ required: false, example: 153 })
  total?: number;

  @ApiProperty({ required: false, example: 16 })
  totalPages?: number;
}

export class ApiResponse<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Patient record retrieved successfully.' })
  message: string;

  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: '2025-10-22T12:33:14Z' })
  timestamp: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ type: [ApiError], required: false })
  errors?: ApiError[];

  @ApiProperty({ type: ApiMeta, required: false })
  meta?: ApiMeta;
}