import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Patients')
@Controller('api/patients')
export class PatientsController {
  @Post()
  @ApiOperation({ summary: 'Create patient' })
  @ApiResponse({ status: 201, description: 'Patient created' })
  create(@Body() createPatientDto: any) {
    return { message: 'Patient created', patient: createPatientDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of patients' })
  findAll() {
    return { message: 'Patients API', patients: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Patient ${id}`, patient: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update patient' })
  update(@Param('id') id: string, @Body() updatePatientDto: any) {
    return { message: `Patient ${id} updated`, patient: updatePatientDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete patient' })
  remove(@Param('id') id: string) {
    return { message: `Patient ${id} deleted` };
  }
}