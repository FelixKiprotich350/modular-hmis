import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { PatientService, PatientRegistrationData, PatientSearchCriteria } from './services/patients.service';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { SearchPatientDto } from './dto/search-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@ApiTags('Patients')
@Controller('api/patients')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class PatientsController {
  constructor(@Inject('patientsService') private readonly patientService: PatientService) {}

  @Post('register')
  @Privileges('create_patients')
  @ApiOperation({ summary: 'Register new patient with demographics and auto-generated ID' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully' })
  @ApiBody({ type: RegisterPatientDto })
  async register(@Body() registerDto: RegisterPatientDto) {
    try {
      const patient = await this.patientService.registerPatient(registerDto);
      return { 
        success: true,
        message: 'Patient registered successfully', 
        patient,
        identifier: patient.identifiers[0]?.identifier
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        duplicates: error.message.includes('duplicate')
      };
    }
  }

  @Post('search')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Search patients by multiple criteria' })
  @ApiResponse({ status: 200, description: 'Search results' })
  @ApiBody({ type: SearchPatientDto })
  async search(@Body() searchDto: SearchPatientDto) {
    const patients = await this.patientService.searchPatients(searchDto);
    return { 
      patients,
      total: patients.length,
      criteria: searchDto
    };
  }

  @Get('search')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Quick search by identifier, name, or phone' })
  async quickSearch(
    @Query('q') query?: string,
    @Query('identifier') identifier?: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string
  ) {
    const criteria: PatientSearchCriteria = {
      identifier: identifier || (query?.match(/^[A-Z0-9]+$/) ? query : undefined),
      name: name || (query && !query.match(/^[A-Z0-9]+$/) ? query : undefined),
      phone: phone
    };
    
    const patients = await this.patientService.searchPatients(criteria);
    return { patients, query: criteria };
  }

  @Post('check-duplicates')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Check for potential duplicate patients' })
  async checkDuplicates(@Body() data: PatientRegistrationData) {
    const duplicates = await this.patientService.findDuplicates(data);
    return {
      hasDuplicates: duplicates.length > 0,
      count: duplicates.length,
      duplicates
    };
  }

  @Get()
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of patients' })
  async findAll() {
    const patients = await this.patientService.listPatients();
    return { patients };
  }

  @Get(':id')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get patient by ID' })
  async findOne(@Param('id') id: string) {
    const patient = await this.patientService.getPatient(id);
    return { patient };
  }

  @Post(':id/identifiers')
  @Privileges('edit_patients')
  @ApiOperation({ summary: 'Add patient identifier' })
  async addIdentifier(@Param('id') patientId: string, @Body() data: { identifierTypeId: string; identifier: string }) {
    const identifier = await this.patientService.addIdentifier(patientId, data.identifierTypeId, data.identifier);
    return { message: 'Identifier added', identifier };
  }

  @Patch(':id')
  @Privileges('edit_patients')
  @ApiOperation({ summary: 'Update patient' })
  @ApiBody({ type: UpdatePatientDto })
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientService.updatePatient(id, updatePatientDto as any);
    return { message: 'Patient updated', patient };
  }

  @Delete(':id')
  @Privileges('delete_patients')
  @ApiOperation({ summary: 'Delete patient' })
  async remove(@Param('id') id: string) {
    const deleted = await this.patientService.deletePatient(id);
    return { message: 'Patient deleted', deleted };
  }
}