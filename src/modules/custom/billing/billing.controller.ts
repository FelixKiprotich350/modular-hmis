import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { Audit } from '../../../core/decorators/audit.decorator';
import { BillingService } from './services/billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@ApiTags('Billing')
@Controller('api/billing')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(@Inject('billingService') private readonly billingService: BillingService) {}

  @Post()
  @Privileges('manage_billing')
  @Audit('Create billing record')
  @ApiOperation({ summary: 'Create billing record' })
  @ApiResponse({ status: 201, description: 'Billing record created successfully' })
  @ApiBody({ type: CreateBillingDto })
  async create(@Body() createDto: CreateBillingDto) {
    const billing = await this.billingService.createBilling(createDto);
    return { success: true, data: billing };
  }

  @Get()
  @Privileges('view_billing')
  @ApiOperation({ summary: 'Get all billing records' })
  @ApiResponse({ status: 200, description: 'List of billing records retrieved successfully' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by billing status' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filter by patient ID' })
  async findAll(@Query('status') status?: string, @Query('patientId') patientId?: string) {
    if (patientId) {
      const billings = await this.billingService.getPatientBillings(patientId);
      return { success: true, data: billings };
    }
    if (status) {
      const billings = await this.billingService.getBillingsByStatus(status);
      return { success: true, data: billings };
    }
    const billings = await this.billingService.listBillings();
    return { success: true, data: billings };
  }

  @Get(':id')
  @Privileges('view_billing')
  @ApiOperation({ summary: 'Get billing record by ID' })
  @ApiResponse({ status: 200, description: 'Billing record retrieved successfully' })
  async findOne(@Param('id') id: string) {
    const billing = await this.billingService.getBilling(id);
    return { success: true, data: billing };
  }

  @Post(':id/payment')
  @Privileges('manage_billing')
  @Audit('Process payment')
  @ApiOperation({ summary: 'Process payment for billing' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  async processPayment(
    @Param('id') id: string,
    @Body() paymentData: { amount: number; method: string }
  ) {
    const result = await this.billingService.processPayment(id, paymentData.amount, paymentData.method);
    return { success: true, data: result };
  }

  @Post(':id/insurance-claim')
  @Privileges('manage_billing')
  @Audit('Process insurance claim')
  @ApiOperation({ summary: 'Process insurance claim' })
  @ApiResponse({ status: 200, description: 'Insurance claim processed successfully' })
  async processInsuranceClaim(
    @Param('id') id: string,
    @Body() claimData: { insuranceId: string }
  ) {
    const result = await this.billingService.processInsuranceClaim(id, claimData.insuranceId);
    return { success: true, data: result };
  }

  @Post('generate-invoice')
  @Privileges('manage_billing')
  @Audit('Generate invoice')
  @ApiOperation({ summary: 'Generate invoice for patient services' })
  @ApiResponse({ status: 201, description: 'Invoice generated successfully' })
  async generateInvoice(
    @Body() invoiceData: {
      patientId: string;
      services: { serviceCode: string; amount: number; description?: string }[];
    }
  ) {
    const invoice = await this.billingService.generateInvoice(invoiceData.patientId, invoiceData.services);
    return { success: true, data: invoice };
  }

  @Patch(':id')
  @Privileges('manage_billing')
  @Audit('Update billing record')
  @ApiOperation({ summary: 'Update billing record' })
  @ApiResponse({ status: 200, description: 'Billing record updated successfully' })
  @ApiBody({ type: UpdateBillingDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateBillingDto) {
    const billing = await this.billingService.updateBilling(id, updateDto);
    return { success: true, data: billing };
  }

  @Delete(':id')
  @Privileges('manage_billing')
  @Audit('Delete billing record')
  @ApiOperation({ summary: 'Delete billing record' })
  @ApiResponse({ status: 200, description: 'Billing record deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.billingService.deleteBilling(id);
    return { success: true, message: 'Billing record deleted successfully' };
  }
}