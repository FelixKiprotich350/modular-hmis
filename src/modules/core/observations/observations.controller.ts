import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateObservationDto {
  patientId: string;
  conceptId: string;
  value: string;
  units?: string;
  notes?: string;
}

class UpdateObservationDto {
  value?: string;
  units?: string;
  notes?: string;
}

@ApiTags('Observations')
@Controller('api/observations')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class ObservationsController {
  @Post()
  @Privileges('create_observations')
  @ApiOperation({ summary: 'Create observation' })
  @ApiResponse({ status: 201, description: 'Observation created' })
  @ApiBody({ type: CreateObservationDto })
  create(@Body() createDto: CreateObservationDto) {
    return { message: 'Observation created', data: createDto };
  }

  @Get()
  @Privileges('view_observations')
  @ApiOperation({ summary: 'Get all observations' })
  @ApiResponse({ status: 200, description: 'List of observations' })
  findAll() {
    return { message: 'Observations API', data: [] };
  }

  @Get(':id')
  @Privileges('view_observations')
  @ApiOperation({ summary: 'Get observations by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Observations ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('create_observations')
  @ApiOperation({ summary: 'Update observation' })
  @ApiBody({ type: UpdateObservationDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateObservationDto) {
    return { message: `Observation ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('create_observations')
  @ApiOperation({ summary: 'Delete observation' })
  remove(@Param('id') id: string) {
    return { message: `Observation ${id} deleted` };
  }
}