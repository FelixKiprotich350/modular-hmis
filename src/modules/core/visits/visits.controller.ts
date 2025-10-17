import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Visits')
@Controller('api/visits')
export class VisitsController {
  @Post()
  @ApiOperation({ summary: 'Create visits' })
  @ApiResponse({ status: 201, description: 'Visits created' })
  create(@Body() createDto: any) {
    return { message: 'Visits created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all visits' })
  @ApiResponse({ status: 200, description: 'List of visits' })
  findAll() {
    return { message: 'Visits API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get visits by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Visits ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update visits' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Visits ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete visits' })
  remove(@Param('id') id: string) {
    return { message: `Visits ${id} deleted` };
  }
}