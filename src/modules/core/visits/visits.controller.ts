import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateVisitDto {
  patientId: string;
  visitType: string;
  startDate: string;
  locationId?: string;
  notes?: string;
}

class UpdateVisitDto {
  visitType?: string;
  endDate?: string;
  locationId?: string;
  notes?: string;
  status?: string;
}

@ApiTags('Visits')
@Controller('api/visits')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class VisitsController {
  @Post()
  @Privileges('create_visits')
  @ApiOperation({ summary: 'Create visit' })
  @ApiResponse({ status: 201, description: 'Visit created' })
  @ApiBody({ type: CreateVisitDto })
  create(@Body() createDto: CreateVisitDto) {
    return { message: 'Visit created', data: createDto };
  }

  @Get()
  @Privileges('view_visits')
  @ApiOperation({ summary: 'Get all visits' })
  @ApiResponse({ status: 200, description: 'List of visits' })
  findAll() {
    return { message: 'Visits API', data: [] };
  }

  @Get(':id')
  @Privileges('view_visits')
  @ApiOperation({ summary: 'Get visit by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Visit ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('create_visits')
  @ApiOperation({ summary: 'Update visit' })
  @ApiBody({ type: UpdateVisitDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateVisitDto) {
    return { message: `Visit ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('create_visits')
  @ApiOperation({ summary: 'Delete visit' })
  remove(@Param('id') id: string) {
    return { message: `Visit ${id} deleted` };
  }
}