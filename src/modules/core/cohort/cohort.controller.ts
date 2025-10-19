import { Controller, Get, Post, Body, Param, Put, Delete, Query, Inject } from '@nestjs/common';
import { CohortService } from './services/cohort.service';
import { Cohort, CohortDefinition } from './models/cohort.model';

@Controller({ path: 'cohorts', version: '1' })
export class CohortController {
  constructor(@Inject('cohortService') private readonly cohortService: CohortService) {}

  @Post()
  async createCohort(@Body() createCohortDto: Omit<Cohort, 'id' | 'createdAt' | 'updatedAt'>) {
    const cohort = await this.cohortService.createCohort(createCohortDto);
    return { message: 'Cohort created', cohort };
  }

  @Get('search')
  async searchCohorts(@Query('q') query: string) {
    const cohorts = await this.cohortService.searchCohorts(query);
    return { cohorts, query };
  }

  @Get('types')
  async getCohortTypes() {
    const types = await this.cohortService.getCohortTypes();
    return { types };
  }

  @Get('by-type/:typeId')
  async getCohortsByType(@Param('typeId') typeId: string) {
    const cohorts = await this.cohortService.getCohortsByType(typeId);
    return { cohorts, typeId };
  }

  @Post('definitions')
  async createCohortDefinition(@Body() definitionDto: Omit<CohortDefinition, 'id' | 'createdAt'>) {
    const definition = await this.cohortService.createCohortDefinition(definitionDto);
    return { message: 'Cohort definition created', definition };
  }

  @Get('definitions')
  async getCohortDefinitions() {
    const definitions = await this.cohortService.getCohortDefinitions();
    return { definitions };
  }

  @Post('definitions/:id/evaluate')
  async evaluateDefinition(@Param('id') definitionId: string) {
    const patientIds = await this.cohortService.evaluateCohortDefinition(definitionId);
    return { patientIds, count: patientIds.length };
  }

  @Get(':id/members')
  async getCohortMembers(@Param('id') cohortId: string) {
    const members = await this.cohortService.getCohortMembers(cohortId);
    return { members, cohortId, count: members.length };
  }

  @Post(':id/members')
  async addPatientToCohort(@Param('id') cohortId: string, @Body() data: { patientId: string }) {
    const member = await this.cohortService.addPatientToCohort(cohortId, data.patientId);
    return { message: 'Patient added to cohort', member };
  }

  @Delete(':id/members/:patientId')
  async removePatientFromCohort(@Param('id') cohortId: string, @Param('patientId') patientId: string) {
    const removed = await this.cohortService.removePatientFromCohort(cohortId, patientId);
    return { message: 'Patient removed from cohort', removed };
  }

  @Get('patient/:patientId')
  async getPatientCohorts(@Param('patientId') patientId: string) {
    const cohorts = await this.cohortService.getPatientCohorts(patientId);
    return { cohorts, patientId };
  }

  @Get(':id/statistics')
  async getCohortStatistics(@Param('id') cohortId: string) {
    const statistics = await this.cohortService.getCohortStatistics(cohortId);
    return { statistics, cohortId };
  }

  @Get(':id/export')
  async exportCohort(@Param('id') cohortId: string, @Query('format') format: 'CSV' | 'JSON' = 'JSON') {
    const exportData = await this.cohortService.exportCohort(cohortId, format);
    return { exportData };
  }

  @Get()
  async listCohorts() {
    const cohorts = await this.cohortService.listCohorts();
    return { cohorts };
  }

  @Get(':id')
  async getCohort(@Param('id') id: string) {
    const cohort = await this.cohortService.getCohort(id);
    return { cohort };
  }

  @Put(':id')
  async updateCohort(@Param('id') id: string, @Body() updateData: Partial<Cohort>) {
    const cohort = await this.cohortService.updateCohort(id, updateData);
    return { message: 'Cohort updated', cohort };
  }

  @Delete(':id')
  async deleteCohort(@Param('id') id: string) {
    const deleted = await this.cohortService.deleteCohort(id);
    return { message: 'Cohort deleted', deleted };
  }
}