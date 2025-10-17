import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Inventory')
@Controller('api/inventory')
export class InventoryController {
  @Post()
  @ApiOperation({ summary: 'Create inventory' })
  @ApiResponse({ status: 201, description: 'Inventory created' })
  create(@Body() createDto: any) {
    return { message: 'Inventory created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory' })
  @ApiResponse({ status: 200, description: 'List of inventory' })
  findAll() {
    return { message: 'Inventory API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Inventory ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inventory' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Inventory ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory' })
  remove(@Param('id') id: string) {
    return { message: `Inventory ${id} deleted` };
  }
}