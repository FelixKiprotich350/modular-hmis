import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Concepts')
@Controller('api/concepts')
export class ConceptsController {
  @Post()
  @ApiOperation({ summary: 'Create concepts' })
  @ApiResponse({ status: 201, description: 'Concepts created' })
  create(@Body() createDto: any) {
    return { message: 'Concepts created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all concepts' })
  @ApiResponse({ status: 200, description: 'List of concepts' })
  findAll() {
    return { message: 'Concepts API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get concepts by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Concepts ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update concepts' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Concepts ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete concepts' })
  remove(@Param('id') id: string) {
    return { message: `Concepts ${id} deleted` };
  }
}