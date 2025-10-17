import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Insurance')
@Controller('api/insurance')
export class InsuranceController {
  @Post()
  @ApiOperation({ summary: 'Create insurance' })
  @ApiResponse({ status: 201, description: 'Insurance created' })
  create(@Body() createDto: any) {
    return { message: 'Insurance created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all insurance' })
  @ApiResponse({ status: 200, description: 'List of insurance' })
  findAll() {
    return { message: 'Insurance API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get insurance by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Insurance ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update insurance' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Insurance ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete insurance' })
  remove(@Param('id') id: string) {
    return { message: `Insurance ${id} deleted` };
  }
}