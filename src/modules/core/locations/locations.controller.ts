import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateLocationDto {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
}

class UpdateLocationDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
}

@ApiTags('Locations')
@Controller('api/locations')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class LocationsController {
  @Post()
  @Privileges('manage_locations')
  @ApiOperation({ summary: 'Create location' })
  @ApiResponse({ status: 201, description: 'Location created' })
  @ApiBody({ type: CreateLocationDto })
  create(@Body() createDto: CreateLocationDto) {
    return { message: 'Location created', data: createDto };
  }

  @Get()
  @Privileges('manage_locations')
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'List of locations' })
  findAll() {
    return { message: 'Locations API', data: [] };
  }

  @Get(':id')
  @Privileges('manage_locations')
  @ApiOperation({ summary: 'Get location by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Location ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('manage_locations')
  @ApiOperation({ summary: 'Update location' })
  @ApiBody({ type: UpdateLocationDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateLocationDto) {
    return { message: `Location ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('manage_locations')
  @ApiOperation({ summary: 'Delete location' })
  remove(@Param('id') id: string) {
    return { message: `Location ${id} deleted` };
  }
}