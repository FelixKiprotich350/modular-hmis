import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { ProviderService } from './services/providers.service';
import { Person } from './models/provider.model';

class CreateProviderDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  sex: 'M' | 'F' | 'U' | 'O';
  gender: 'Man' | 'Woman' | 'Transgender';
  birthdate?: Date;
  phone?: string;
  email?: string;
  identifier?: string;
}

class UpdateProviderDto {
  name?: string;
  identifier?: string;
  retired?: boolean;
}

@ApiTags('Providers')
@Controller({ path: 'providers', version: '1' })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class ProvidersController {
  constructor(@Inject('providerService') private readonly providersService: ProviderService) {}

  @Post()
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Create provider' })
  @ApiResponse({ status: 201, description: 'Provider created' })
  @ApiBody({ type: CreateProviderDto })
  async create(@Body() createDto: CreateProviderDto) {
    const provider = await this.providersService.createProvider(createDto, createDto.identifier);
    return { message: 'Provider created', provider };
  }

  @Get('search')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Search providers' })
  async search(@Query('q') query: string) {
    const providers = await this.providersService.searchProviders(query);
    return { providers, query };
  }

  @Get('roles')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Get provider roles' })
  async getRoles() {
    const roles = await this.providersService.getProviderRoles();
    return { roles };
  }

  @Get('by-role/:roleId')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Get providers by role' })
  async getByRole(@Param('roleId') roleId: string) {
    const providers = await this.providersService.getProvidersByRole(roleId);
    return { providers, roleId };
  }

  @Get('by-location/:locationId')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Get providers by location' })
  async getByLocation(@Param('locationId') locationId: string) {
    const providers = await this.providersService.getProvidersByLocation(locationId);
    return { providers, locationId };
  }

  @Get(':id/attributes')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Get provider attributes' })
  async getAttributes(@Param('id') providerId: string) {
    const attributes = await this.providersService.getProviderAttributes(providerId);
    return { attributes, providerId };
  }

  @Post(':id/attributes')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Add provider attribute' })
  async addAttribute(@Param('id') providerId: string, @Body() data: { attributeTypeId: string; value: string }) {
    const attribute = await this.providersService.addProviderAttribute(providerId, data.attributeTypeId, data.value);
    return { message: 'Attribute added', attribute };
  }

  @Post(':id/roles')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Assign provider role' })
  async assignRole(@Param('id') providerId: string, @Body() data: { roleId: string; locationId?: string }) {
    const assignment = await this.providersService.assignProviderRole(providerId, data.roleId, data.locationId);
    return { message: 'Role assigned', assignment };
  }

  @Put(':id/retire')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Retire provider' })
  async retire(@Param('id') providerId: string, @Body() data: { reason?: string }) {
    const provider = await this.providersService.retireProvider(providerId, data.reason);
    return { message: 'Provider retired', provider };
  }

  @Get()
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Get all providers' })
  @ApiResponse({ status: 200, description: 'List of providers' })
  async findAll() {
    const providers = await this.providersService.listProviders();
    return { providers };
  }

  @Get(':id')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Get provider by ID' })
  async findOne(@Param('id') id: string) {
    const provider = await this.providersService.getProvider(id);
    return { provider };
  }

  @Patch(':id')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Update provider' })
  @ApiBody({ type: UpdateProviderDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateProviderDto) {
    const provider = await this.providersService.updateProvider(id, updateDto);
    return { message: 'Provider updated', provider };
  }

  @Delete(':id')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Delete provider' })
  async remove(@Param('id') id: string) {
    const deleted = await this.providersService.deleteProvider(id);
    return { message: 'Provider deleted', deleted };
  }
}