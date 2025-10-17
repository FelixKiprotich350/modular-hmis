import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';

class CreateBillingDto {
  patientId: string;
  serviceCode: string;
  amount: number;
  description?: string;
  insuranceId?: string;
}

class UpdateBillingDto {
  serviceCode?: string;
  amount?: number;
  description?: string;
  status?: string;
  paymentDate?: string;
}

@ApiTags('Billing')
@Controller('api/billing')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class BillingController {
  @Post()
  @Privileges('manage_billing')
  @ApiOperation({ summary: 'Create billing record' })
  @ApiResponse({ status: 201, description: 'Billing record created' })
  @ApiBody({ type: CreateBillingDto })
  create(@Body() createDto: CreateBillingDto) {
    return { message: 'Billing record created', data: createDto };
  }

  @Get()
  @Privileges('view_billing')
  @ApiOperation({ summary: 'Get all billing records' })
  @ApiResponse({ status: 200, description: 'List of billing records' })
  findAll() {
    return { message: 'Billing API', data: [] };
  }

  @Get(':id')
  @Privileges('view_billing')
  @ApiOperation({ summary: 'Get billing record by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Billing record ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('manage_billing')
  @ApiOperation({ summary: 'Update billing record' })
  @ApiBody({ type: UpdateBillingDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateBillingDto) {
    return { message: `Billing record ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('manage_billing')
  @ApiOperation({ summary: 'Delete billing record' })
  remove(@Param('id') id: string) {
    return { message: `Billing record ${id} deleted` };
  }
}