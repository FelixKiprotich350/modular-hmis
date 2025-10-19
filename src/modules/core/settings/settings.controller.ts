import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateSettingDto {
  key: string;
  value: string;
  category?: string;
  description?: string;
}

class UpdateSettingDto {
  value?: string;
  category?: string;
  description?: string;
}

@ApiTags('Settings')
@Controller({ path: 'settings', version: '1' })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class SettingsController {
  @Post()
  @Privileges('manage_settings')
  @ApiOperation({ summary: 'Create setting' })
  @ApiResponse({ status: 201, description: 'Setting created' })
  @ApiBody({ type: CreateSettingDto })
  create(@Body() createDto: CreateSettingDto) {
    return { message: 'Setting created', data: createDto };
  }

  @Get()
  @Privileges('manage_settings')
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, description: 'List of settings' })
  findAll() {
    return { message: 'Settings API', data: [] };
  }

  @Get(':id')
  @Privileges('manage_settings')
  @ApiOperation({ summary: 'Get setting by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Setting ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('manage_settings')
  @ApiOperation({ summary: 'Update setting' })
  @ApiBody({ type: UpdateSettingDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateSettingDto) {
    return { message: `Setting ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('manage_settings')
  @ApiOperation({ summary: 'Delete setting' })
  remove(@Param('id') id: string) {
    return { message: `Setting ${id} deleted` };
  }
}