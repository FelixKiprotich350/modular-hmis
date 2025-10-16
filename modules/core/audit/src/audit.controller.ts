import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Audit')
@Controller('api/audit')
export class AuditController {
  @Post()
  @ApiOperation({ summary: 'Create audit' })
  @ApiResponse({ status: 201, description: 'Audit created' })
  create(@Body() createDto: any) {
    return { message: 'Audit created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all audit' })
  @ApiResponse({ status: 200, description: 'List of audit' })
  findAll() {
    return { message: 'Audit API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Audit ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update audit' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Audit ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete audit' })
  remove(@Param('id') id: string) {
    return { message: `Audit ${id} deleted` };
  }
}