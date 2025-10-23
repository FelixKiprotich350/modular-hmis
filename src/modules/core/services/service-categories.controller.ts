import { Controller, Get, Post, Body, Param, Put, Delete, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ServiceCategoriesService } from './services/service-categories.service';
import { CreateServiceCategoryDto, UpdateServiceCategoryDto } from './dto/create-service-category.dto';

@ApiTags('Service Categories')
@Controller('api/service-categories')
export class ServiceCategoriesController {
  constructor(@Inject('serviceCategoriesService') private readonly serviceCategoriesService: ServiceCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service category' })
  @ApiResponse({ status: 201, description: 'Service category created successfully' })
  async createServiceCategory(@Body() createServiceCategoryDto: CreateServiceCategoryDto) {
    return await this.serviceCategoriesService.createServiceCategory(createServiceCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service categories' })
  @ApiResponse({ status: 200, description: 'List of service categories' })
  async getServiceCategories() {
    return await this.serviceCategoriesService.listServiceCategories();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search service categories' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchServiceCategories(@Query('q') query: string) {
    return await this.serviceCategoriesService.searchServiceCategories(query);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get service category by code' })
  @ApiResponse({ status: 200, description: 'Service category details' })
  async getServiceCategoryByCode(@Param('code') code: string) {
    return await this.serviceCategoriesService.getServiceCategoryByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service category by ID' })
  @ApiResponse({ status: 200, description: 'Service category details' })
  async getServiceCategory(@Param('id') id: string) {
    return await this.serviceCategoriesService.getServiceCategory(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update service category' })
  @ApiResponse({ status: 200, description: 'Service category updated successfully' })
  async updateServiceCategory(@Param('id') id: string, @Body() updateServiceCategoryDto: UpdateServiceCategoryDto) {
    return await this.serviceCategoriesService.updateServiceCategory(id, updateServiceCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate service category' })
  @ApiResponse({ status: 200, description: 'Service category deactivated successfully' })
  async deactivateServiceCategory(@Param('id') id: string) {
    return await this.serviceCategoriesService.deactivateServiceCategory(id);
  }
}