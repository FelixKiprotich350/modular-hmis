import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Appointments')
@Controller('api/appointments')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class AppointmentsController {
  @Post()
  @Privileges('create_appointments')
  @ApiOperation({ summary: 'Create appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created' })
  @ApiBody({ type: CreateAppointmentDto })
  create(@Body() createDto: CreateAppointmentDto) {
    return { message: 'Appointment created', data: createDto };
  }

  @Get()
  @Privileges('view_appointments')
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'List of appointments' })
  findAll() {
    return { message: 'Appointments API', data: [] };
  }

  @Get(':id')
  @Privileges('view_appointments')
  @ApiOperation({ summary: 'Get appointment by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Appointment ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('edit_appointments')
  @ApiOperation({ summary: 'Update appointment' })
  @ApiBody({ type: UpdateAppointmentDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateAppointmentDto) {
    return { message: `Appointment ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('edit_appointments')
  @ApiOperation({ summary: 'Delete appointment' })
  remove(@Param('id') id: string) {
    return { message: `Appointment ${id} deleted` };
  }
}