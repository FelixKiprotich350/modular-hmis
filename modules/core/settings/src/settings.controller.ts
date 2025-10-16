import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Settings')
@Controller('api/settings')
export class SettingsController {
  @Post()
  @ApiOperation({ summary: 'Create settings' })
  @ApiResponse({ status: 201, description: 'Settings created' })
  create(@Body() createDto: any) {
    return { message: 'Settings created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, description: 'List of settings' })
  findAll() {
    return { message: 'Settings API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get settings by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Settings ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update settings' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Settings ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete settings' })
  remove(@Param('id') id: string) {
    return { message: `Settings ${id} deleted` };
  }
}