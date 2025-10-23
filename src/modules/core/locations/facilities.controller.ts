import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocationService } from './services/locations.service';
import { CreateFacilityDto } from './dto/create-facility.dto';

@ApiTags('Facilities')
@Controller('api/facilities')
export class FacilitiesController {
  constructor(@Inject('locationService') private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new facility' })
  @ApiResponse({ status: 201, description: 'Facility created successfully' })
  async createFacility(@Body() createFacilityDto: CreateFacilityDto) {
    return await this.locationService.createFacility(createFacilityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all facilities' })
  @ApiResponse({ status: 200, description: 'List of facilities' })
  async getFacilities() {
    return await this.locationService.listFacilities();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get facility by ID' })
  @ApiResponse({ status: 200, description: 'Facility details' })
  async getFacility(@Param('id') id: string) {
    return await this.locationService.getFacility(id);
  }

  @Get(':id/departments')
  @ApiOperation({ summary: 'Get facility departments' })
  @ApiResponse({ status: 200, description: 'List of departments' })
  async getFacilityDepartments(@Param('id') facilityId: string) {
    return await this.locationService.getFacilityDepartments(facilityId);
  }

  @Get(':id/locations')
  @ApiOperation({ summary: 'Get facility locations' })
  @ApiResponse({ status: 200, description: 'List of locations' })
  async getFacilityLocations(@Param('id') facilityId: string) {
    return await this.locationService.getFacilityLocations(facilityId);
  }
}