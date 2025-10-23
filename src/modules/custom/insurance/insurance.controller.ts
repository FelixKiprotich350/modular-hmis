import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { Audit } from '../../../core/decorators/audit.decorator';
import { InsuranceService } from './services/insurance.service';

class CreateInsuranceDto {
  policyNumber: string;
  provider: string;
  policyHolder: string;
  coverage?: any;
}

class UpdateInsuranceDto {
  provider?: string;
  policyHolder?: string;
  coverage?: any;
}

@ApiTags('Insurance')
@Controller({ path: 'insurance', version: '1' })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class InsuranceController {
  constructor(@Inject('insuranceService') private readonly insuranceService: InsuranceService) {}

  @Post()
  @Privileges('manage_insurance')
  @Audit('Create insurance record')
  @ApiOperation({ summary: 'Create insurance record' })
  @ApiResponse({ status: 201, description: 'Insurance record created successfully' })
  @ApiBody({ type: CreateInsuranceDto })
  async create(@Body() createDto: CreateInsuranceDto) {
    const insurance = await this.insuranceService.createInsurance(createDto);
    return insurance;
  }

  @Get()
  @Privileges('view_insurance')
  @ApiOperation({ summary: 'Get all insurance records' })
  @ApiResponse({ status: 200, description: 'List of insurance records retrieved successfully' })
  async findAll() {
    const insurances = await this.insuranceService.listInsurances();
    return insurances;
  }

  @Get('verify/:policyNumber')
  @Privileges('view_insurance')
  @ApiOperation({ summary: 'Verify insurance by policy number' })
  @ApiResponse({ status: 200, description: 'Insurance verification completed' })
  async verifyInsurance(@Param('policyNumber') policyNumber: string) {
    const verification = await this.insuranceService.verifyInsurance(policyNumber);
    return verification;
  }

  @Get('coverage/:insuranceId/:serviceCode')
  @Privileges('view_insurance')
  @ApiOperation({ summary: 'Get insurance coverage for service' })
  @ApiResponse({ status: 200, description: 'Coverage information retrieved successfully' })
  async getCoverage(@Param('insuranceId') insuranceId: string, @Param('serviceCode') serviceCode: string) {
    const coverage = await this.insuranceService.getInsuranceCoverage(insuranceId, serviceCode);
    return coverage;
  }

  @Get('reports')
  @Privileges('view_insurance')
  @ApiOperation({ summary: 'Generate insurance report' })
  @ApiResponse({ status: 200, description: 'Insurance report generated successfully' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Report start date' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Report end date' })
  async generateReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    const report = await this.insuranceService.generateInsuranceReport(new Date(startDate), new Date(endDate));
    return report;
  }

  @Get(':id')
  @Privileges('view_insurance')
  @ApiOperation({ summary: 'Get insurance record by ID' })
  @ApiResponse({ status: 200, description: 'Insurance record retrieved successfully' })
  async findOne(@Param('id') id: string) {
    const insurance = await this.insuranceService.getInsurance(id);
    return insurance;
  }

  @Post('claims/submit')
  @Privileges('manage_insurance')
  @Audit('Submit insurance claim')
  @ApiOperation({ summary: 'Submit insurance claim' })
  @ApiResponse({ status: 201, description: 'Insurance claim submitted successfully' })
  async submitClaim(
    @Body() claimData: {
      insuranceId: string;
      billingId: string;
      amount: number;
    }
  ) {
    const claim = await this.insuranceService.submitClaim(
      claimData.insuranceId,
      claimData.billingId,
      claimData.amount
    );
    return claim;
  }

  @Post('claims/:claimNumber/process')
  @Privileges('manage_insurance')
  @Audit('Process insurance claim')
  @ApiOperation({ summary: 'Process insurance claim' })
  @ApiResponse({ status: 200, description: 'Insurance claim processed successfully' })
  async processClaim(
    @Param('claimNumber') claimNumber: string,
    @Body() processData: {
      status: 'approved' | 'denied';
      denialReason?: string;
    }
  ) {
    const result = await this.insuranceService.processClaim(
      claimNumber,
      processData.status,
      processData.denialReason
    );
    return result;
  }

  @Patch(':id')
  @Privileges('manage_insurance')
  @Audit('Update insurance record')
  @ApiOperation({ summary: 'Update insurance record' })
  @ApiResponse({ status: 200, description: 'Insurance record updated successfully' })
  @ApiBody({ type: UpdateInsuranceDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInsuranceDto) {
    const insurance = await this.insuranceService.updateInsurance(id, updateDto);
    return insurance;
  }

  @Delete(':id')
  @Privileges('manage_insurance')
  @Audit('Delete insurance record')
  @ApiOperation({ summary: 'Delete insurance record' })
  @ApiResponse({ status: 200, description: 'Insurance record deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.insuranceService.deleteInsurance(id);
    return 'Insurance record deleted successfully';
  }
}