import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Pharmacy')
@Controller('api/pharmacy')
export class PharmacyController {
  @Post()
  @ApiOperation({ summary: 'Create pharmacy' })
  @ApiResponse({ status: 201, description: 'Pharmacy created' })
  create(@Body() createDto: any) {
    return { message: 'Pharmacy created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all pharmacy' })
  @ApiResponse({ status: 200, description: 'List of pharmacy' })
  findAll() {
    return { message: 'Pharmacy API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pharmacy by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Pharmacy ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pharmacy' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Pharmacy ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pharmacy' })
  remove(@Param('id') id: string) {
    return { message: `Pharmacy ${id} deleted` };
  }
}