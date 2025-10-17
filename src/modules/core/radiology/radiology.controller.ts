import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateRadiologyDto {
  patientId: string;
  orderType: string;
  bodyPart: string;
  urgency?: string;
  notes?: string;
}

class UpdateRadiologyDto {
  orderType?: string;
  bodyPart?: string;
  urgency?: string;
  notes?: string;
  status?: string;
}

@ApiTags('Radiology')
@Controller('api/radiology')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class RadiologyController {
  @Post()
  @Privileges('create_radiology_orders')
  @ApiOperation({ summary: 'Create radiology order' })
  @ApiResponse({ status: 201, description: 'Radiology order created' })
  @ApiBody({ type: CreateRadiologyDto })
  create(@Body() createDto: CreateRadiologyDto) {
    return { message: 'Radiology order created', data: createDto };
  }

  @Get()
  @Privileges('view_radiology')
  @ApiOperation({ summary: 'Get all radiology' })
  @ApiResponse({ status: 200, description: 'List of radiology' })
  findAll() {
    return { message: 'Radiology API', data: [] };
  }

  @Get(':id')
  @Privileges('view_radiology')
  @ApiOperation({ summary: 'Get radiology by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Radiology ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('create_radiology_orders')
  @ApiOperation({ summary: 'Update radiology order' })
  @ApiBody({ type: UpdateRadiologyDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateRadiologyDto) {
    return { message: `Radiology order ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('create_radiology_orders')
  @ApiOperation({ summary: 'Delete radiology order' })
  remove(@Param('id') id: string) {
    return { message: `Radiology order ${id} deleted` };
  }
}