import { Controller, Get, Post, Put, Param, Body, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiVersion } from '../../../core/decorators/api-version.decorator';
import { AppointmentFhirMapper } from './mappers/appointment-fhir.mapper';
import { AppointmentService } from './services/appointments.service';

@ApiTags('Appointments - FHIR R4')
@Controller('fhir')
@ApiVersion('fhir')
export class AppointmentsFhirController {
  constructor(
    @Inject('appointmentService') private appointmentService: AppointmentService
  ) {}

  @Get('Appointment')
  @ApiOperation({ summary: 'Search appointments (FHIR R4)' })
  async searchAppointments(@Query() query: any) {
    const appointments = await this.appointmentService.listAppointments();
    
    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: appointments.length,
      entry: appointments.map(appointment => ({
        resource: AppointmentFhirMapper.toFhir(appointment)
      }))
    };
  }

  @Get('Appointment/:id')
  @ApiOperation({ summary: 'Get appointment by ID (FHIR R4)' })
  async getAppointment(@Param('id') id: string) {
    const appointment = await this.appointmentService.getAppointment(id);
    return AppointmentFhirMapper.toFhir(appointment);
  }

  @Post('Appointment')
  @ApiOperation({ summary: 'Create appointment (FHIR R4)' })
  async createAppointment(@Body() fhirAppointment: any) {
    const appointmentData = AppointmentFhirMapper.fromFhir(fhirAppointment);
    const appointment = await this.appointmentService.createAppointment(appointmentData);
    return AppointmentFhirMapper.toFhir(appointment);
  }

  @Put('Appointment/:id')
  @ApiOperation({ summary: 'Update appointment (FHIR R4)' })
  async updateAppointment(@Param('id') id: string, @Body() fhirAppointment: any) {
    const appointmentData = AppointmentFhirMapper.fromFhir(fhirAppointment);
    const appointment = await this.appointmentService.updateAppointment(id, appointmentData);
    return AppointmentFhirMapper.toFhir(appointment);
  }
}