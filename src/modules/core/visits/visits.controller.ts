import { Controller, Get, Post, Body, Param, Put, Query, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VisitService } from './services/visits.service';
import { Visit } from './models/visit.model';

@ApiTags('Visits')
@Controller({ path: 'visits', version: '1' })
export class VisitsController {
  constructor(@Inject('visitsService') private readonly visitsService: VisitService) {}

  @Post()
  async createVisit(@Body() createVisitDto: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>) {
    const visit = await this.visitsService.createVisit(createVisitDto);
    return { message: 'Visit created', visit };
  }

  @Post('start')
  async startVisit(@Body() data: { patientId: string; visitType: string; notes?: string }) {
    const visit = await this.visitsService.startVisit(data.patientId, data.visitType, data.notes);
    return { message: 'Visit started', visit };
  }

  @Put(':id/end')
  async endVisit(@Param('id') visitId: string, @Body() data: { notes?: string }) {
    const visit = await this.visitsService.endVisit(visitId, data.notes);
    return { message: 'Visit ended', visit };
  }

  @Get('types')
  async getVisitTypes() {
    const types = await this.visitsService.getVisitTypes();
    return { types };
  }

  @Get('active')
  async getActiveVisits() {
    const visits = await this.visitsService.getActiveVisits();
    return { visits };
  }

  @Get('patient/:patientId')
  async getPatientVisits(@Param('patientId') patientId: string) {
    const visits = await this.visitsService.getPatientVisits(patientId);
    return { visits, patientId };
  }

  @Get('patient/:patientId/active')
  async getPatientActiveVisit(@Param('patientId') patientId: string) {
    const visit = await this.visitsService.getPatientActiveVisit(patientId);
    return { visit, patientId };
  }

  @Get('by-type/:type')
  async getVisitsByType(@Param('type') visitType: string) {
    const visits = await this.visitsService.getVisitsByType(visitType);
    return { visits, visitType };
  }

  @Get('by-date')
  async getVisitsByDateRange(@Query('start') startDate: string, @Query('end') endDate: string) {
    const visits = await this.visitsService.getVisitsByDateRange(new Date(startDate), new Date(endDate));
    return { visits, startDate, endDate };
  }

  @Get(':id/encounters')
  async getVisitWithEncounters(@Param('id') id: string) {
    const visit = await this.visitsService.getVisitWithEncounters(id);
    return { visit };
  }

  @Post(':id/encounters')
  async addEncounterToVisit(@Param('id') visitId: string, @Body() encounterData: { patientId: string; providerId: string; locationId?: string; encounterType: string; notes?: string }) {
    const encounter = await this.visitsService.addEncounterToVisit(visitId, { ...encounterData, startDate: new Date() });
    return { message: 'Encounter added to visit', encounter };
  }

  @Get()
  async listVisits() {
    const visits = await this.visitsService.listVisits();
    return { visits };
  }

  @Get(':id')
  async getVisit(@Param('id') id: string) {
    const visit = await this.visitsService.getVisit(id);
    return { visit };
  }

  @Put(':id')
  async updateVisit(@Param('id') id: string, @Body() updateData: Partial<Visit>) {
    const visit = await this.visitsService.updateVisit(id, updateData);
    return { message: 'Visit updated', visit };
  }
}