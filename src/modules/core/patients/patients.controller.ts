import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@ApiTags('Patients')
@Controller('api/patients')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class PatientsController {
  @Post()
  @Privileges('create_patients')
  @ApiOperation({ summary: 'Create patient' })
  @ApiResponse({ status: 201, description: 'Patient created' })
  @ApiBody({ type: CreatePatientDto })
  create(@Body() createPatientDto: CreatePatientDto) {
    return { message: 'Patient created', patient: createPatientDto };
  }

  @Get()
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of patients' })
  findAll() {
    return { message: 'Patients API', patients: [] };
  }

  @Get(':id')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get patient by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Patient ${id}`, patient: null };
  }

  @Patch(':id')
  @Privileges('edit_patients')
  @ApiOperation({ summary: 'Update patient' })
  @ApiBody({ type: UpdatePatientDto })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return { message: `Patient ${id} updated`, patient: updatePatientDto };
  }

  @Delete(':id')
  @Privileges('delete_patients')
  @ApiOperation({ summary: 'Delete patient' })
  remove(@Param('id') id: string) {
    return { message: `Patient ${id} deleted` };
  }
}