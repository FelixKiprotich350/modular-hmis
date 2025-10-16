import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Locations')
@Controller('api/locations')
export class LocationsController {
  @Post()
  @ApiOperation({ summary: 'Create locations' })
  @ApiResponse({ status: 201, description: 'Locations created' })
  create(@Body() createDto: any) {
    return { message: 'Locations created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'List of locations' })
  findAll() {
    return { message: 'Locations API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get locations by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Locations ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update locations' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Locations ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete locations' })
  remove(@Param('id') id: string) {
    return { message: `Locations ${id} deleted` };
  }
}