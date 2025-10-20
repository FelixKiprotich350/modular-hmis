import { Controller, Get, Post, Body, Param, Put, Query, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EncounterService } from './services/encounters.service';
import { Encounter } from './models/encounter.model';

@ApiTags('Encounters')
@Controller({ path: 'encounters', version: '1' })
export class EncountersController {
  constructor(@Inject('encountersService') private readonly encountersService: EncounterService) {}

  @Post()
  async createEncounter(@Body() createEncounterDto: Omit<Encounter, 'id' | 'createdAt' | 'updatedAt'>) {
    const encounter = await this.encountersService.createEncounter(createEncounterDto);
    return { message: 'Encounter created', encounter };
  }

  @Get('types')
  async getEncounterTypes() {
    const types = await this.encountersService.getEncounterTypes();
    return { types };
  }

  @Get('patient/:patientId')
  async getPatientEncounters(@Param('patientId') patientId: string) {
    const encounters = await this.encountersService.getPatientEncounters(patientId);
    return { encounters, patientId };
  }

  @Get('provider/:providerId')
  async getProviderEncounters(@Param('providerId') providerId: string) {
    const encounters = await this.encountersService.getEncountersByProvider(providerId);
    return { encounters, providerId };
  }

  @Get('by-type/:type')
  async getEncountersByType(@Param('type') encounterType: string) {
    const encounters = await this.encountersService.getEncountersByType(encounterType);
    return { encounters, encounterType };
  }

  @Get('by-date')
  async getEncountersByDateRange(@Query('start') startDate: string, @Query('end') endDate: string) {
    const encounters = await this.encountersService.getEncountersByDateRange(new Date(startDate), new Date(endDate));
    return { encounters, startDate, endDate };
  }

  @Get(':id/observations')
  async getEncounterWithObservations(@Param('id') id: string) {
    const encounter = await this.encountersService.getEncounterWithObservations(id);
    return { encounter };
  }

  @Post(':id/observations')
  async addObservation(@Param('id') encounterId: string, @Body() obsData: { patientId: string; conceptId: string; value: string; units?: string; notes?: string }) {
    const observation = await this.encountersService.addObservationToEncounter(encounterId, { ...obsData, obsDate: new Date() });
    return { message: 'Observation added', observation };
  }

  @Put(':id/close')
  async closeEncounter(@Param('id') encounterId: string) {
    const encounter = await this.encountersService.closeEncounter(encounterId);
    return { message: 'Encounter closed', encounter };
  }

  @Get()
  async listEncounters() {
    const encounters = await this.encountersService.listEncounters();
    return { encounters };
  }

  @Get(':id')
  async getEncounter(@Param('id') id: string) {
    const encounter = await this.encountersService.getEncounter(id);
    return { encounter };
  }

  @Put(':id')
  async updateEncounter(@Param('id') id: string, @Body() updateData: Partial<Encounter>) {
    const encounter = await this.encountersService.updateEncounter(id, updateData);
    return { message: 'Encounter updated', encounter };
  }
}