import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Observations')
@Controller('api/observations')
export class ObservationsController {
  @Post()
  @ApiOperation({ summary: 'Create observations' })
  @ApiResponse({ status: 201, description: 'Observations created' })
  create(@Body() createDto: any) {
    return { message: 'Observations created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all observations' })
  @ApiResponse({ status: 200, description: 'List of observations' })
  findAll() {
    return { message: 'Observations API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get observations by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Observations ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update observations' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Observations ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete observations' })
  remove(@Param('id') id: string) {
    return { message: `Observations ${id} deleted` };
  }
}