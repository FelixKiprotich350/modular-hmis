import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { Audit } from '../../../core/decorators/audit.decorator';
import { User } from '../../../core/decorators/user.decorator';
import { PharmacyService } from './services/pharmacy.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@ApiTags('Pharmacy')
@Controller({ path: 'pharmacy', version: '1' })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class PharmacyController {
  constructor(@Inject('pharmacyService') private readonly pharmacyService: PharmacyService) {}

  @Post('prescriptions')
  @Privileges('manage_pharmacy')
  @Audit('Create prescription')
  @ApiOperation({ summary: 'Create prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  @ApiBody({ type: CreatePharmacyDto })
  async createPrescription(@Body() createDto: CreatePharmacyDto) {
    const prescription = await this.pharmacyService.createPrescription(createDto);
    return prescription;
  }

  @Get('prescriptions')
  @Privileges('view_pharmacy')
  @ApiOperation({ summary: 'Get all prescriptions' })
  @ApiResponse({ status: 200, description: 'List of prescriptions retrieved successfully' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filter by patient ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by prescription status' })
  async findAllPrescriptions(@Query('patientId') patientId?: string, @Query('status') status?: string) {
    if (patientId) {
      const prescriptions = await this.pharmacyService.getPatientPrescriptions(patientId, status);
      return prescriptions;
    }
    const prescriptions = await this.pharmacyService.listPrescriptions();
    return prescriptions;
  }

  @Get('prescriptions/pending')
  @Privileges('view_pharmacy')
  @ApiOperation({ summary: 'Get pending prescriptions' })
  @ApiResponse({ status: 200, description: 'Pending prescriptions retrieved successfully' })
  async getPendingPrescriptions() {
    const prescriptions = await this.pharmacyService.getPendingPrescriptions();
    return prescriptions;
  }

  @Get('medications/search')
  @Privileges('view_pharmacy')
  @ApiOperation({ summary: 'Search medications' })
  @ApiResponse({ status: 200, description: 'Medications found successfully' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  async searchMedications(@Query('q') query: string) {
    const medications = await this.pharmacyService.searchMedications(query);
    return medications;
  }

  @Post('drug-interactions')
  @Privileges('view_pharmacy')
  @ApiOperation({ summary: 'Check drug interactions' })
  @ApiResponse({ status: 200, description: 'Drug interactions checked successfully' })
  async checkDrugInteractions(@Body() data: { medications: string[] }) {
    const interactions = await this.pharmacyService.getDrugInteractions(data.medications);
    return interactions;
  }

  @Get('reports')
  @Privileges('view_pharmacy')
  @ApiOperation({ summary: 'Generate pharmacy report' })
  @ApiResponse({ status: 200, description: 'Pharmacy report generated successfully' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Report start date' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Report end date' })
  async generateReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    const report = await this.pharmacyService.generatePharmacyReport(new Date(startDate), new Date(endDate));
    return report;
  }

  @Get('prescriptions/:id')
  @Privileges('view_pharmacy')
  @ApiOperation({ summary: 'Get prescription by ID' })
  @ApiResponse({ status: 200, description: 'Prescription retrieved successfully' })
  async findOnePrescription(@Param('id') id: string) {
    const prescription = await this.pharmacyService.getPrescription(id);
    return prescription;
  }

  @Post('prescriptions/:id/dispense')
  @Privileges('manage_pharmacy')
  @Audit('Dispense medication')
  @ApiOperation({ summary: 'Dispense medication' })
  @ApiResponse({ status: 200, description: 'Medication dispensed successfully' })
  async dispenseMedication(
    @Param('id') id: string,
    @Body() dispensationData: {
      quantityDispensed: number;
      notes?: string;
    },
    @User() user: any
  ) {
    const result = await this.pharmacyService.dispenseMedication(
      id,
      user.id,
      dispensationData.quantityDispensed,
      dispensationData.notes
    );
    return result;
  }

  @Post('prescriptions/:id/refill')
  @Privileges('manage_pharmacy')
  @Audit('Refill prescription')
  @ApiOperation({ summary: 'Refill prescription' })
  @ApiResponse({ status: 201, description: 'Prescription refilled successfully' })
  async refillPrescription(
    @Param('id') id: string,
    @Body() refillData: { quantity: number },
    @User() user: any
  ) {
    const refill = await this.pharmacyService.refillPrescription(id, refillData.quantity, user.id);
    return refill;
  }

  @Patch('prescriptions/:id')
  @Privileges('manage_pharmacy')
  @Audit('Update prescription')
  @ApiOperation({ summary: 'Update prescription' })
  @ApiResponse({ status: 200, description: 'Prescription updated successfully' })
  @ApiBody({ type: UpdatePharmacyDto })
  async updatePrescription(@Param('id') id: string, @Body() updateDto: UpdatePharmacyDto) {
    const prescription = await this.pharmacyService.updatePrescription(id, updateDto);
    return prescription;
  }

  @Delete('prescriptions/:id')
  @Privileges('manage_pharmacy')
  @Audit('Delete prescription')
  @ApiOperation({ summary: 'Delete prescription' })
  @ApiResponse({ status: 200, description: 'Prescription deleted successfully' })
  async removePrescription(@Param('id') id: string) {
    await this.pharmacyService.deletePrescription(id);
    return 'Prescription deleted successfully';
  }
}