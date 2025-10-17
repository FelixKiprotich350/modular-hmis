import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateProviderDto {
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
}

class UpdateProviderDto {
  firstName?: string;
  lastName?: string;
  specialty?: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
}

@ApiTags('Providers')
@Controller('api/providers')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class ProvidersController {
  @Post()
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Create provider' })
  @ApiResponse({ status: 201, description: 'Provider created' })
  @ApiBody({ type: CreateProviderDto })
  create(@Body() createDto: CreateProviderDto) {
    return { message: 'Provider created', data: createDto };
  }

  @Get()
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Get all providers' })
  @ApiResponse({ status: 200, description: 'List of providers' })
  findAll() {
    return { message: 'Providers API', data: [] };
  }

  @Get(':id')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Get provider by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Provider ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Update provider' })
  @ApiBody({ type: UpdateProviderDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateProviderDto) {
    return { message: `Provider ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('manage_providers')
  @ApiOperation({ summary: 'Delete provider' })
  remove(@Param('id') id: string) {
    return { message: `Provider ${id} deleted` };
  }
}