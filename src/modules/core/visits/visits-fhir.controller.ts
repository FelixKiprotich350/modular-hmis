import { Controller, Get, Post, Put, Param, Body, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiVersion } from '../../../core/decorators/api-version.decorator';
import { VisitFhirMapper } from './mappers/visit-fhir.mapper';
import { VisitService } from './services/visits.service';

@ApiTags('Visits - FHIR R4 (as Encounters)')
@Controller('fhir')
@ApiVersion('fhir')
export class VisitsFhirController {
  constructor(
    @Inject('visitService') private visitService: VisitService
  ) {}

  @Get('Encounter/visit')
  @ApiOperation({ summary: 'Search visits as FHIR Encounters' })
  async searchVisits(@Query() query: any) {
    const visits = await this.visitService.listVisits();
    
    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: visits.length,
      entry: visits.map(visit => ({
        resource: VisitFhirMapper.toFhir(visit)
      }))
    };
  }

  @Get('Encounter/visit/:id')
  @ApiOperation({ summary: 'Get visit by ID as FHIR Encounter' })
  async getVisit(@Param('id') id: string) {
    const visit = await this.visitService.getVisit(id);
    return VisitFhirMapper.toFhir(visit);
  }

  @Post('Encounter/visit')
  @ApiOperation({ summary: 'Create visit as FHIR Encounter' })
  async createVisit(@Body() fhirEncounter: any) {
    const visitData = VisitFhirMapper.fromFhir(fhirEncounter);
    const visit = await this.visitService.createVisit(visitData);
    return VisitFhirMapper.toFhir(visit);
  }

  @Put('Encounter/visit/:id')
  @ApiOperation({ summary: 'Update visit as FHIR Encounter' })
  async updateVisit(@Param('id') id: string, @Body() fhirEncounter: any) {
    const visitData = VisitFhirMapper.fromFhir(fhirEncounter);
    const visit = await this.visitService.updateVisit(id, visitData);
    return VisitFhirMapper.toFhir(visit);
  }
}