import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Encounters')
@Controller('api/encounters')
export class EncountersController {
  @Post()
  @ApiOperation({ summary: 'Create encounters' })
  @ApiResponse({ status: 201, description: 'Encounters created' })
  create(@Body() createDto: any) {
    return { message: 'Encounters created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all encounters' })
  @ApiResponse({ status: 200, description: 'List of encounters' })
  findAll() {
    return { message: 'Encounters API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get encounters by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Encounters ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update encounters' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Encounters ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete encounters' })
  remove(@Param('id') id: string) {
    return { message: `Encounters ${id} deleted` };
  }
}