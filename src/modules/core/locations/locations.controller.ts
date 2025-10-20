import { Controller, Get, Post, Body, Param, Put, Delete, Query, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocationService } from './services/locations.service';
import { Location } from './models/location.model';

@ApiTags('Locations')
@Controller({ path: 'locations', version: '1' })
export class LocationsController {
  constructor(@Inject('locationsService') private readonly locationsService: LocationService) {}

  @Post()
  async createLocation(@Body() createLocationDto: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) {
    const location = await this.locationsService.createLocation(createLocationDto);
    return { message: 'Location created', location };
  }

  @Get('search')
  async searchLocations(@Query('q') query: string) {
    const locations = await this.locationsService.searchLocations(query);
    return { locations, query };
  }

  @Get('tags')
  async getLocationTags() {
    const tags = await this.locationsService.getLocationTags();
    return { tags };
  }

  @Get('by-tag/:tagId')
  async getLocationsByTag(@Param('tagId') tagId: string) {
    const locations = await this.locationsService.getLocationsByTag(tagId);
    return { locations, tagId };
  }

  @Get(':id/hierarchy')
  async getLocationHierarchy(@Param('id') id: string) {
    const hierarchy = await this.locationsService.getLocationHierarchy(id);
    return { hierarchy, locationId: id };
  }

  @Get(':id/children')
  async getChildLocations(@Param('id') parentId: string) {
    const children = await this.locationsService.getChildLocations(parentId);
    return { children, parentId };
  }

  @Get(':id/attributes')
  async getLocationAttributes(@Param('id') locationId: string) {
    const attributes = await this.locationsService.getLocationAttributes(locationId);
    return { attributes, locationId };
  }

  @Post(':id/attributes')
  async addLocationAttribute(@Param('id') locationId: string, @Body() data: { attributeTypeId: string; value: string }) {
    const attribute = await this.locationsService.addLocationAttribute(locationId, data.attributeTypeId, data.value);
    return { message: 'Attribute added', attribute };
  }

  @Put(':id/retire')
  async retireLocation(@Param('id') locationId: string, @Body() data: { reason?: string }) {
    const location = await this.locationsService.retireLocation(locationId, data.reason);
    return { message: 'Location retired', location };
  }

  @Get()
  async listLocations() {
    const locations = await this.locationsService.listLocations();
    return { locations };
  }

  @Get(':id')
  async getLocation(@Param('id') id: string) {
    const location = await this.locationsService.getLocation(id);
    return { location };
  }

  @Put(':id')
  async updateLocation(@Param('id') id: string, @Body() updateData: Partial<Location>) {
    const location = await this.locationsService.updateLocation(id, updateData);
    return { message: 'Location updated', location };
  }

  @Delete(':id')
  async deleteLocation(@Param('id') id: string) {
    const deleted = await this.locationsService.deleteLocation(id);
    return { message: 'Location deleted', deleted };
  }
}