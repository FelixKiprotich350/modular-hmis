import { Controller, Get, Post, Put, Param, Body, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiVersion } from '../../../core/decorators/api-version.decorator';
import { FhirTransformerService } from '../../../core/fhir/fhir-transformer.service';
import { PatientService } from './services/patients.service';

@ApiTags('Patients - FHIR R4')
@Controller('fhir')
@ApiVersion('fhir')
export class PatientsFhirController {
  constructor(
    @Inject('patientService') private patientService: PatientService,
    private fhirTransformer: FhirTransformerService
  ) {}

  @Get('Patient')
  @ApiOperation({ summary: 'Search patients (FHIR R4)' })
  async searchPatients(@Query() query: any) {
    const patients = await this.patientService.listPatients();
    
    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: patients.length,
      entry: patients.map(patient => ({
        resource: this.fhirTransformer.patientToFhir(patient)
      }))
    };
  }

  @Get('Patient/:id')
  @ApiOperation({ summary: 'Get patient by ID (FHIR R4)' })
  async getPatient(@Param('id') id: string) {
    const patient = await this.patientService.getPatient(id);
    return this.fhirTransformer.patientToFhir(patient);
  }

  @Post('Patient')
  @ApiOperation({ summary: 'Create patient (FHIR R4)' })
  async createPatient(@Body() fhirPatient: any) {
    const patientData = this.fhirTransformer.fhirToPatient(fhirPatient);
    const patient = await this.patientService.registerPatient(patientData);
    return this.fhirTransformer.patientToFhir(patient);
  }

  @Put('Patient/:id')
  @ApiOperation({ summary: 'Update patient (FHIR R4)' })
  async updatePatient(@Param('id') id: string, @Body() fhirPatient: any) {
    const patientData = this.fhirTransformer.fhirToPatient(fhirPatient);
    const patient = await this.patientService.updatePatient(id, patientData);
    return this.fhirTransformer.patientToFhir(patient);
  }
}