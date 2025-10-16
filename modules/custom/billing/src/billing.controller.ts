import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Billing')
@Controller('api/billing')
export class BillingController {
  @Post()
  @ApiOperation({ summary: 'Create billing' })
  @ApiResponse({ status: 201, description: 'Billing created' })
  create(@Body() createDto: any) {
    return { message: 'Billing created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all billing' })
  @ApiResponse({ status: 200, description: 'List of billing' })
  findAll() {
    return { message: 'Billing API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get billing by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Billing ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update billing' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Billing ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete billing' })
  remove(@Param('id') id: string) {
    return { message: `Billing ${id} deleted` };
  }
}