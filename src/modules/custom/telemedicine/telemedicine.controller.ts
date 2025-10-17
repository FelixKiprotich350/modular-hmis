import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateTelemedicineDto {
  patientId: string;
  providerId: string;
  scheduledDateTime: string;
  platform: string;
  meetingUrl?: string;
  notes?: string;
}

class UpdateTelemedicineDto {
  scheduledDateTime?: string;
  platform?: string;
  meetingUrl?: string;
  notes?: string;
  status?: string;
}

@ApiTags('Telemedicine')
@Controller('api/telemedicine')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class TelemedicineController {
  @Post()
  @Privileges('manage_telemedicine')
  @ApiOperation({ summary: 'Create telemedicine session' })
  @ApiResponse({ status: 201, description: 'Telemedicine session created' })
  @ApiBody({ type: CreateTelemedicineDto })
  create(@Body() createDto: CreateTelemedicineDto) {
    return { message: 'Telemedicine session created', data: createDto };
  }

  @Get()
  @Privileges('view_telemedicine')
  @ApiOperation({ summary: 'Get all telemedicine sessions' })
  @ApiResponse({ status: 200, description: 'List of telemedicine sessions' })
  findAll() {
    return { message: 'Telemedicine API', data: [] };
  }

  @Get(':id')
  @Privileges('view_telemedicine')
  @ApiOperation({ summary: 'Get telemedicine session by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Telemedicine session ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('manage_telemedicine')
  @ApiOperation({ summary: 'Update telemedicine session' })
  @ApiBody({ type: UpdateTelemedicineDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateTelemedicineDto) {
    return { message: `Telemedicine session ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('manage_telemedicine')
  @ApiOperation({ summary: 'Delete telemedicine session' })
  remove(@Param('id') id: string) {
    return { message: `Telemedicine session ${id} deleted` };
  }
}