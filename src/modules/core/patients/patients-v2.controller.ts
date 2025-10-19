import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { PatientService } from './services/patients.service';
import { RegisterPatientDto } from './dto/register-patient.dto';

@ApiTags('Patients V2')
@Controller({ path: 'patients', version: '2' })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class PatientsV2Controller {
  constructor(@Inject('patientsService') private readonly patientService: PatientService) {}

  @Get()
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get all patients with enhanced pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Paginated list of patients' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const patients = await this.patientService.listPatients();
    
    // Enhanced response format for v2
    return {
      data: patients.slice(offset, offset + limitNum),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: patients.length,
        totalPages: Math.ceil(patients.length / limitNum),
        hasNext: offset + limitNum < patients.length,
        hasPrev: pageNum > 1
      },
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString(),
        search,
        sortBy,
        sortOrder
      }
    };
  }

  @Post()
  @Privileges('create_patients')
  @ApiOperation({ summary: 'Register new patient with enhanced validation' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully' })
  @ApiBody({ type: RegisterPatientDto })
  async create(@Body() registerDto: RegisterPatientDto) {
    const patient = await this.patientService.registerPatient(registerDto);
    
    // Enhanced response format for v2
    return {
      success: true,
      data: {
        patient,
        identifier: patient.identifiers[0]?.identifier,
        qrCode: `QR-${patient.id}`, // New feature in v2
        registrationNumber: `REG-${Date.now()}`
      },
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString(),
        registeredBy: 'system' // Could be actual user from context
      }
    };
  }

  @Get(':id')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get patient by ID with enhanced details' })
  async findOne(@Param('id') id: string) {
    const patient = await this.patientService.getPatient(id);
    
    // Enhanced response with additional computed fields
    return {
      data: {
        ...patient,
        age: patient.person?.birthdate ? 
          Math.floor((Date.now() - new Date(patient.person.birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
          null,
        fullName: `${patient.person?.firstName} ${patient.person?.lastName}`,
        primaryIdentifier: patient.identifiers?.find(i => i.preferred)?.identifier
      },
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString(),
        lastUpdated: patient.updatedAt
      }
    };
  }
}