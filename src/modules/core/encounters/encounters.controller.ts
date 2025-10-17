import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';

class CreateEncounterDto {
  patientId: string;
  providerId: string;
  encounterType: string;
  chiefComplaint?: string;
  notes?: string;
}

class UpdateEncounterDto {
  encounterType?: string;
  chiefComplaint?: string;
  notes?: string;
  status?: string;
}

@ApiTags('Encounters')
@Controller('api/encounters')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class EncountersController {
  @Post()
  @Privileges('create_encounters')
  @ApiOperation({ summary: 'Create encounter' })
  @ApiResponse({ status: 201, description: 'Encounter created' })
  @ApiBody({ type: CreateEncounterDto })
  create(@Body() createDto: CreateEncounterDto) {
    return { message: 'Encounter created', data: createDto };
  }

  @Get()
  @Privileges('view_encounters')
  @ApiOperation({ summary: 'Get all encounters' })
  @ApiResponse({ status: 200, description: 'List of encounters' })
  findAll() {
    return { message: 'Encounters API', data: [] };
  }

  @Get(':id')
  @Privileges('view_encounters')
  @ApiOperation({ summary: 'Get encounter by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Encounter ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('edit_encounters')
  @ApiOperation({ summary: 'Update encounter' })
  @ApiBody({ type: UpdateEncounterDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateEncounterDto) {
    return { message: `Encounter ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('edit_encounters')
  @ApiOperation({ summary: 'Delete encounter' })
  remove(@Param('id') id: string) {
    return { message: `Encounter ${id} deleted` };
  }
}