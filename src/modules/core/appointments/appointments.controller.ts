import { Controller, Get, Post, Body, Param, Put, Delete, Query, Inject } from '@nestjs/common';
import { AppointmentService } from './services/appointments.service';
import { Appointment } from './models/appointment.model';

@Controller('api/appointments')
export class AppointmentsController {
  constructor(@Inject('appointmentsService') private readonly appointmentService: AppointmentService) {}

  @Post()
  async createAppointment(@Body() createAppointmentDto: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    const appointment = await this.appointmentService.createAppointment(createAppointmentDto);
    return { message: 'Appointment created', appointment };
  }

  @Get('types')
  async getAppointmentTypes() {
    const types = await this.appointmentService.getAppointmentTypes();
    return { types };
  }

  @Get('patient/:patientId')
  async getPatientAppointments(@Param('patientId') patientId: string) {
    const appointments = await this.appointmentService.getPatientAppointments(patientId);
    return { appointments, patientId };
  }

  @Get('provider/:providerId')
  async getProviderAppointments(@Param('providerId') providerId: string, @Query('date') date?: string) {
    const appointmentDate = date ? new Date(date) : undefined;
    const appointments = await this.appointmentService.getProviderAppointments(providerId, appointmentDate);
    return { appointments, providerId, date };
  }

  @Get('by-date')
  async getAppointmentsByDate(@Query('date') date: string, @Query('location') locationId?: string) {
    const appointments = await this.appointmentService.getAppointmentsByDate(new Date(date), locationId);
    return { appointments, date, locationId };
  }

  @Get('available-slots')
  async getAvailableSlots(@Query('provider') providerId: string, @Query('date') date: string, @Query('type') appointmentTypeId: string) {
    const slots = await this.appointmentService.getAvailableSlots(providerId, new Date(date), appointmentTypeId);
    return { slots, providerId, date, appointmentTypeId };
  }

  @Post('blocks')
  async createAppointmentBlock(@Body() blockData: { providerId: string; locationId: string; startDate: Date; endDate: Date; appointmentTypeId: string; maxAppointments: number }) {
    const block = await this.appointmentService.createAppointmentBlock(blockData);
    return { message: 'Appointment block created', block };
  }

  @Get('provider/:providerId/schedule')
  async getProviderSchedule(@Param('providerId') providerId: string, @Query('start') startDate: string, @Query('end') endDate: string) {
    const schedule = await this.appointmentService.getProviderSchedule(providerId, new Date(startDate), new Date(endDate));
    return { schedule, providerId, startDate, endDate };
  }

  @Put(':id/reschedule')
  async rescheduleAppointment(@Param('id') appointmentId: string, @Body() data: { newDate: Date; newTime: string }) {
    const appointment = await this.appointmentService.rescheduleAppointment(appointmentId, data.newDate, data.newTime);
    return { message: 'Appointment rescheduled', appointment };
  }

  @Put(':id/cancel')
  async cancelAppointment(@Param('id') appointmentId: string, @Body() data: { reason?: string }) {
    const appointment = await this.appointmentService.cancelAppointment(appointmentId, data.reason);
    return { message: 'Appointment cancelled', appointment };
  }

  @Put(':id/checkin')
  async checkInAppointment(@Param('id') appointmentId: string) {
    const appointment = await this.appointmentService.checkInAppointment(appointmentId);
    return { message: 'Patient checked in', appointment };
  }

  @Get()
  async listAppointments() {
    const appointments = await this.appointmentService.listAppointments();
    return { appointments };
  }

  @Get(':id')
  async getAppointment(@Param('id') id: string) {
    const appointment = await this.appointmentService.getAppointment(id);
    return { appointment };
  }

  @Put(':id')
  async updateAppointment(@Param('id') id: string, @Body() updateData: Partial<Appointment>) {
    const appointment = await this.appointmentService.updateAppointment(id, updateData);
    return { message: 'Appointment updated', appointment };
  }

  @Delete(':id')
  async deleteAppointment(@Param('id') id: string) {
    const deleted = await this.appointmentService.deleteAppointment(id);
    return { message: 'Appointment deleted', deleted };
  }
}