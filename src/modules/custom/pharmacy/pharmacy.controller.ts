import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreatePharmacyDto {
  medicationName: string;
  dosage: string;
  quantity: number;
  patientId: string;
  prescriberId: string;
}

class UpdatePharmacyDto {
  dosage?: string;
  quantity?: number;
  status?: string;
  dispensedDate?: string;
}

@ApiTags('Pharmacy')
@Controller('api/pharmacy')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class PharmacyController {
  @Post()
  @Privileges('manage_pharmacy')
  @ApiOperation({ summary: 'Create prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created' })
  @ApiBody({ type: CreatePharmacyDto })
  create(@Body() createDto: CreatePharmacyDto) {
    return { message: 'Prescription created', data: createDto };
  }

  @Get()
  @Privileges('view_pharmacy')
  @ApiOperation({ summary: 'Get all pharmacy' })
  @ApiResponse({ status: 200, description: 'List of pharmacy' })
  findAll() {
    return { message: 'Pharmacy API', data: [] };
  }

  @Get(':id')
  @Privileges('view_pharmacy')
  @ApiOperation({ summary: 'Get pharmacy by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Pharmacy ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('manage_pharmacy')
  @ApiOperation({ summary: 'Update pharmacy' })
  @ApiBody({ type: UpdatePharmacyDto })
  update(@Param('id') id: string, @Body() updateDto: UpdatePharmacyDto) {
    return { message: `Pharmacy ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('manage_pharmacy')
  @ApiOperation({ summary: 'Delete pharmacy' })
  remove(@Param('id') id: string) {
    return { message: `Pharmacy ${id} deleted` };
  }
}