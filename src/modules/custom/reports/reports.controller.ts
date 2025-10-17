import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('api/reports')
export class ReportsController {
  @Post()
  @ApiOperation({ summary: 'Create reports' })
  @ApiResponse({ status: 201, description: 'Reports created' })
  create(@Body() createDto: any) {
    return { message: 'Reports created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, description: 'List of reports' })
  findAll() {
    return { message: 'Reports API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reports by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Reports ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reports' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Reports ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reports' })
  remove(@Param('id') id: string) {
    return { message: `Reports ${id} deleted` };
  }
}