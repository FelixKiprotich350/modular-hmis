import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('MobileClinic')
@Controller('api/mobile-clinic')
export class MobileClinicController {
  @Post()
  @ApiOperation({ summary: 'Create mobile-clinic' })
  @ApiResponse({ status: 201, description: 'MobileClinic created' })
  create(@Body() createDto: any) {
    return { message: 'MobileClinic created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all mobile-clinic' })
  @ApiResponse({ status: 200, description: 'List of mobile-clinic' })
  findAll() {
    return { message: 'MobileClinic API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mobile-clinic by ID' })
  findOne(@Param('id') id: string) {
    return { message: `MobileClinic ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update mobile-clinic' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `MobileClinic ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete mobile-clinic' })
  remove(@Param('id') id: string) {
    return { message: `MobileClinic ${id} deleted` };
  }
}