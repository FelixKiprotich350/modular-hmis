import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Telemedicine')
@Controller('api/telemedicine')
export class TelemedicineController {
  @Post()
  @ApiOperation({ summary: 'Create telemedicine' })
  @ApiResponse({ status: 201, description: 'Telemedicine created' })
  create(@Body() createDto: any) {
    return { message: 'Telemedicine created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all telemedicine' })
  @ApiResponse({ status: 200, description: 'List of telemedicine' })
  findAll() {
    return { message: 'Telemedicine API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get telemedicine by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Telemedicine ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update telemedicine' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Telemedicine ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete telemedicine' })
  remove(@Param('id') id: string) {
    return { message: `Telemedicine ${id} deleted` };
  }
}