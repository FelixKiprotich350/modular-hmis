import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Providers')
@Controller('api/providers')
export class ProvidersController {
  @Post()
  @ApiOperation({ summary: 'Create providers' })
  @ApiResponse({ status: 201, description: 'Providers created' })
  create(@Body() createDto: any) {
    return { message: 'Providers created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all providers' })
  @ApiResponse({ status: 200, description: 'List of providers' })
  findAll() {
    return { message: 'Providers API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get providers by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Providers ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update providers' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Providers ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete providers' })
  remove(@Param('id') id: string) {
    return { message: `Providers ${id} deleted` };
  }
}