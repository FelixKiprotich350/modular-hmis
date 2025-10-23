import { Controller, Get, Post, Body, Param, Put, Delete, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ServicesService } from './services/services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(@Inject('servicesService') private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.createService(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiResponse({ status: 200, description: 'List of services' })
  async getServices(@Query('categoryId') categoryId?: string) {
    return await this.servicesService.listServices(categoryId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all service categories' })
  @ApiResponse({ status: 200, description: 'List of service categories' })
  async getServiceCategories() {
    return await this.servicesService.getServiceCategories();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search services' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchServices(@Query('q') query: string) {
    return await this.servicesService.searchServices(query);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get services by category' })
  @ApiResponse({ status: 200, description: 'Services in category' })
  async getServicesByCategory(@Param('categoryId') categoryId: string) {
    return await this.servicesService.getServicesByCategory(categoryId);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get service by code' })
  @ApiResponse({ status: 200, description: 'Service details' })
  async getServiceByCode(@Param('code') code: string) {
    return await this.servicesService.getServiceByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ status: 200, description: 'Service details' })
  async getService(@Param('id') id: string) {
    return await this.servicesService.getService(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  async updateService(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return await this.servicesService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate service' })
  @ApiResponse({ status: 200, description: 'Service deactivated successfully' })
  async deactivateService(@Param('id') id: string) {
    return await this.servicesService.deactivateService(id);
  }
}