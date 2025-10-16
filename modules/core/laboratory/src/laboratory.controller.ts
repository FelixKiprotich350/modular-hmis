import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Laboratory')
@Controller('api/laboratory')
export class LaboratoryController {
  @Post()
  @ApiOperation({ summary: 'Create laboratory' })
  @ApiResponse({ status: 201, description: 'Laboratory created' })
  create(@Body() createDto: any) {
    return { message: 'Laboratory created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all laboratory' })
  @ApiResponse({ status: 200, description: 'List of laboratory' })
  findAll() {
    return { message: 'Laboratory API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get laboratory by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Laboratory ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update laboratory' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Laboratory ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete laboratory' })
  remove(@Param('id') id: string) {
    return { message: `Laboratory ${id} deleted` };
  }
}