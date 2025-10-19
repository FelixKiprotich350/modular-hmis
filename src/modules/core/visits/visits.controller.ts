import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { VisitService } from './services/visits.service';
import { Visit } from './models/visit.model';

@Controller('api/visits')
export class VisitsController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  async createVisit(@Body() createVisitDto: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>) {
    const visit = await this.visitService.createVisit(createVisitDto);
    return { message: 'Visit created', visit };
  }

  @Post('start')
  async startVisit(@Body() data: { patientId: string; visitType: string; notes?: string }) {
    const visit = await this.visitService.startVisit(data.patientId, data.visitType, data.notes);
    return { message: 'Visit started', visit };
  }

  @Put(':id/end')
  async endVisit(@Param('id') visitId: string, @Body() data: { notes?: string }) {
    const visit = await this.visitService.endVisit(visitId, data.notes);
    return { message: 'Visit ended', visit };
  }

  @Get('types')
  async getVisitTypes() {
    const types = await this.visitService.getVisitTypes();
    return { types };
  }

  @Get('active')
  async getActiveVisits() {
    const visits = await this.visitService.getActiveVisits();
    return { visits };
  }

  @Get('patient/:patientId')
  async getPatientVisits(@Param('patientId') patientId: string) {
    const visits = await this.visitService.getPatientVisits(patientId);
    return { visits, patientId };
  }

  @Get('patient/:patientId/active')
  async getPatientActiveVisit(@Param('patientId') patientId: string) {
    const visit = await this.visitService.getPatientActiveVisit(patientId);
    return { visit, patientId };
  }

  @Get('by-type/:type')
  async getVisitsByType(@Param('type') visitType: string) {
    const visits = await this.visitService.getVisitsByType(visitType);
    return { visits, visitType };
  }

  @Get('by-date')
  async getVisitsByDateRange(@Query('start') startDate: string, @Query('end') endDate: string) {
    const visits = await this.visitService.getVisitsByDateRange(new Date(startDate), new Date(endDate));
    return { visits, startDate, endDate };
  }

  @Get(':id/encounters')
  async getVisitWithEncounters(@Param('id') id: string) {
    const visit = await this.visitService.getVisitWithEncounters(id);
    return { visit };
  }

  @Post(':id/encounters')
  async addEncounterToVisit(@Param('id') visitId: string, @Body() encounterData: { patientId: string; providerId: string; locationId?: string; encounterType: string; notes?: string }) {
    const encounter = await this.visitService.addEncounterToVisit(visitId, encounterData);
    return { message: 'Encounter added to visit', encounter };
  }

  @Get()
  async listVisits() {
    const visits = await this.visitService.listVisits();
    return { visits };
  }

  @Get(':id')
  async getVisit(@Param('id') id: string) {
    const visit = await this.visitService.getVisit(id);
    return { visit };
  }

  @Put(':id')
  async updateVisit(@Param('id') id: string, @Body() updateData: Partial<Visit>) {
    const visit = await this.visitService.updateVisit(id, updateData);
    return { message: 'Visit updated', visit };
  }
}