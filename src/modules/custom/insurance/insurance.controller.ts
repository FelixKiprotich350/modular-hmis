import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateInsuranceDto {
  patientId: string;
  insuranceCompany: string;
  policyNumber: string;
  groupNumber?: string;
  coverageType: string;
  effectiveDate: string;
}

class UpdateInsuranceDto {
  insuranceCompany?: string;
  policyNumber?: string;
  groupNumber?: string;
  coverageType?: string;
  effectiveDate?: string;
  status?: string;
}

@ApiTags('Insurance')
@Controller('api/insurance')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class InsuranceController {
  @Post()
  @Privileges('manage_insurance')
  @ApiOperation({ summary: 'Create insurance record' })
  @ApiResponse({ status: 201, description: 'Insurance record created' })
  @ApiBody({ type: CreateInsuranceDto })
  create(@Body() createDto: CreateInsuranceDto) {
    return { message: 'Insurance record created', data: createDto };
  }

  @Get()
  @Privileges('view_insurance')
  @ApiOperation({ summary: 'Get all insurance records' })
  @ApiResponse({ status: 200, description: 'List of insurance records' })
  findAll() {
    return { message: 'Insurance API', data: [] };
  }

  @Get(':id')
  @Privileges('view_insurance')
  @ApiOperation({ summary: 'Get insurance record by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Insurance record ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('manage_insurance')
  @ApiOperation({ summary: 'Update insurance record' })
  @ApiBody({ type: UpdateInsuranceDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateInsuranceDto) {
    return { message: `Insurance record ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('manage_insurance')
  @ApiOperation({ summary: 'Delete insurance record' })
  remove(@Param('id') id: string) {
    return { message: `Insurance record ${id} deleted` };
  }
}