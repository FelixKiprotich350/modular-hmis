import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('api/admin')
export class AdminController {
  @Post()
  @ApiOperation({ summary: 'Create admin' })
  @ApiResponse({ status: 201, description: 'Admin created' })
  create(@Body() createDto: any) {
    return { message: 'Admin created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all admin' })
  @ApiResponse({ status: 200, description: 'List of admin' })
  findAll() {
    return { message: 'Admin API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Admin ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update admin' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Admin ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin' })
  remove(@Param('id') id: string) {
    return { message: `Admin ${id} deleted` };
  }
}