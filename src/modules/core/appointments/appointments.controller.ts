import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Appointments')
@Controller('api/appointments')
export class AppointmentsController {
  @Post()
  @ApiOperation({ summary: 'Create appointments' })
  @ApiResponse({ status: 201, description: 'Appointments created' })
  create(@Body() createDto: any) {
    return { message: 'Appointments created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'List of appointments' })
  findAll() {
    return { message: 'Appointments API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointments by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Appointments ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointments' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `Appointments ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointments' })
  remove(@Param('id') id: string) {
    return { message: `Appointments ${id} deleted` };
  }
}