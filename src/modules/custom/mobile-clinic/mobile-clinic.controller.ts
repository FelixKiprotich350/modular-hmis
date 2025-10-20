import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateMobileClinicDto {
  vehicleId: string;
  locationName: string;
  address: string;
  scheduledDate: string;
  services?: string[];
}

class UpdateMobileClinicDto {
  locationName?: string;
  address?: string;
  scheduledDate?: string;
  services?: string[];
  status?: string;
}

@ApiTags('Mobile Clinic')
@Controller({ path: 'mobile-clinic', version: '1' })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class MobileClinicController {
  @Post()
  @Privileges('manage_mobile_clinic')
  @ApiOperation({ summary: 'Create mobile clinic visit' })
  @ApiResponse({ status: 201, description: 'Mobile clinic visit created' })
  @ApiBody({ type: CreateMobileClinicDto })
  create(@Body() createDto: CreateMobileClinicDto) {
    return { message: 'Mobile clinic visit created', data: createDto };
  }

  @Get()
  @Privileges('view_mobile_clinic')
  @ApiOperation({ summary: 'Get all mobile clinic visits' })
  @ApiResponse({ status: 200, description: 'List of mobile clinic visits' })
  findAll() {
    return { message: 'Mobile Clinic API', data: [] };
  }

  @Get(':id')
  @Privileges('view_mobile_clinic')
  @ApiOperation({ summary: 'Get mobile clinic visit by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Mobile clinic visit ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('manage_mobile_clinic')
  @ApiOperation({ summary: 'Update mobile clinic visit' })
  @ApiBody({ type: UpdateMobileClinicDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateMobileClinicDto) {
    return { message: `Mobile clinic visit ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('manage_mobile_clinic')
  @ApiOperation({ summary: 'Delete mobile clinic visit' })
  remove(@Param('id') id: string) {
    return { message: `Mobile clinic visit ${id} deleted` };
  }
}