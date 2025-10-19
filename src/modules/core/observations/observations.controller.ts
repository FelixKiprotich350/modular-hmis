import { Controller, Get, Post, Body, Param, Put, Query, Delete, Inject } from '@nestjs/common';
import { ObservationService } from './services/observations.service';
import { Observation } from './models/observation.model';

@Controller('api/observations')
export class ObservationsController {
  constructor(@Inject('observationsService') private readonly observationsService: ObservationService) {}

  @Post()
  async createObservation(@Body() createObsDto: Omit<Observation, 'id' | 'createdAt' | 'updatedAt'>) {
    const observation = await this.observationsService.createObservation(createObsDto);
    return { message: 'Observation created', observation };
  }

  @Post('group')
  async createObservationGroup(@Body() data: { patientId: string; encounterId: string; conceptId: string; observations: Omit<Observation, 'id' | 'createdAt' | 'updatedAt'>[] }) {
    const group = await this.observationsService.createObservationGroup(data.patientId, data.encounterId, data.conceptId, data.observations);
    return { message: 'Observation group created', group };
  }

  @Post('vitals')
  async recordVitalSigns(@Body() data: { patientId: string; encounterId: string; vitals: { conceptId: string; value: string; units?: string }[] }) {
    const observations = await this.observationsService.recordVitalSigns(data.patientId, data.encounterId, data.vitals);
    return { message: 'Vital signs recorded', observations };
  }

  @Get('patient/:patientId')
  async getPatientObservations(@Param('patientId') patientId: string, @Query('concept') conceptId?: string) {
    const observations = await this.observationsService.getPatientObservations(patientId, conceptId);
    return { observations, patientId, conceptId };
  }

  @Get('patient/:patientId/vitals')
  async getPatientVitalSigns(@Param('patientId') patientId: string, @Query('encounter') encounterId?: string) {
    const vitals = await this.observationsService.getVitalSigns(patientId, encounterId);
    return { vitals, patientId, encounterId };
  }

  @Get('patient/:patientId/latest/:conceptId')
  async getLatestObservation(@Param('patientId') patientId: string, @Param('conceptId') conceptId: string) {
    const observation = await this.observationsService.getLatestObservation(patientId, conceptId);
    return { observation, patientId, conceptId };
  }

  @Get('encounter/:encounterId')
  async getEncounterObservations(@Param('encounterId') encounterId: string) {
    const observations = await this.observationsService.getEncounterObservations(encounterId);
    return { observations, encounterId };
  }

  @Get('concept/:conceptId')
  async getObservationsByConcept(@Param('conceptId') conceptId: string) {
    const observations = await this.observationsService.getObservationsByConcept(conceptId);
    return { observations, conceptId };
  }

  @Get('patient/:patientId/by-date')
  async getObservationsByDateRange(@Param('patientId') patientId: string, @Query('start') startDate: string, @Query('end') endDate: string) {
    const observations = await this.observationsService.getObservationsByDateRange(patientId, new Date(startDate), new Date(endDate));
    return { observations, patientId, startDate, endDate };
  }

  @Get()
  async listObservations() {
    const observations = await this.observationsService.listObservations();
    return { observations };
  }

  @Get(':id')
  async getObservation(@Param('id') id: string) {
    const observation = await this.observationsService.getObservation(id);
    return { observation };
  }

  @Put(':id')
  async updateObservation(@Param('id') id: string, @Body() updateData: Partial<Observation>) {
    const observation = await this.observationsService.updateObservation(id, updateData);
    return { message: 'Observation updated', observation };
  }

  @Put(':id/void')
  async voidObservation(@Param('id') id: string, @Body() data: { reason: string }) {
    const observation = await this.observationsService.voidObservation(id, data.reason);
    return { message: 'Observation voided', observation };
  }

  @Delete(':id')
  async deleteObservation(@Param('id') id: string) {
    const deleted = await this.observationsService.deleteObservation(id);
    return { message: 'Observation deleted', deleted };
  }
}