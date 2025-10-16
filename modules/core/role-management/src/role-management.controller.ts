import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('RoleManagement')
@Controller('api/role-management')
export class RoleManagementController {
  @Post()
  @ApiOperation({ summary: 'Create role-management' })
  @ApiResponse({ status: 201, description: 'RoleManagement created' })
  create(@Body() createDto: any) {
    return { message: 'RoleManagement created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all role-management' })
  @ApiResponse({ status: 200, description: 'List of role-management' })
  findAll() {
    return { message: 'RoleManagement API', data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role-management by ID' })
  findOne(@Param('id') id: string) {
    return { message: `RoleManagement ${id}`, data: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role-management' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return { message: `RoleManagement ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role-management' })
  remove(@Param('id') id: string) {
    return { message: `RoleManagement ${id} deleted` };
  }
}