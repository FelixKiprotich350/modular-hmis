import { Controller, Get, Post, Put, Param, Body, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiVersion } from '../../../core/decorators/api-version.decorator';
import { EncounterFhirMapper } from './mappers/encounter-fhir.mapper';
import { EncounterService } from './services/encounters.service';

@ApiTags('Encounters - FHIR R4')
@Controller('fhir')
@ApiVersion('fhir')
export class EncountersFhirController {
  constructor(
    @Inject('encounterService') private encounterService: EncounterService
  ) {}

  @Get('Encounter')
  @ApiOperation({ summary: 'Search encounters (FHIR R4)' })
  async searchEncounters(@Query() query: any) {
    const encounters = await this.encounterService.listEncounters();
    
    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: encounters.length,
      entry: encounters.map(encounter => ({
        resource: EncounterFhirMapper.toFhir(encounter)
      }))
    };
  }

  @Get('Encounter/:id')
  @ApiOperation({ summary: 'Get encounter by ID (FHIR R4)' })
  async getEncounter(@Param('id') id: string) {
    const encounter = await this.encounterService.getEncounter(id);
    return EncounterFhirMapper.toFhir(encounter);
  }

  @Post('Encounter')
  @ApiOperation({ summary: 'Create encounter (FHIR R4)' })
  async createEncounter(@Body() fhirEncounter: any) {
    const encounterData = EncounterFhirMapper.fromFhir(fhirEncounter);
    const encounter = await this.encounterService.createEncounter(encounterData);
    return EncounterFhirMapper.toFhir(encounter);
  }

  @Put('Encounter/:id')
  @ApiOperation({ summary: 'Update encounter (FHIR R4)' })
  async updateEncounter(@Param('id') id: string, @Body() fhirEncounter: any) {
    const encounterData = EncounterFhirMapper.fromFhir(fhirEncounter);
    const encounter = await this.encounterService.updateEncounter(id, encounterData);
    return EncounterFhirMapper.toFhir(encounter);
  }
}