import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Radiology')
@Controller('api/radiology')
export class RadiologyController {
  @Post()
  @ApiOperation({ summary: 'Create radiology' })
  @ApiResponse({ status: 201, description: 'Radiology created' })
  create(@Body() createDto: any) {
    return { message: 'Radiology created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all radiology' })
  @ApiResponse({ status: 200, description: 'List of radiology' })
  findAll() {
    return { message: 'Radiology API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get radiology by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Radiology ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update radiology' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Radiology ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete radiology' })
  remove(@Param('id') id: string) {
    return { message: `Radiology ${id} deleted` };
  }
}