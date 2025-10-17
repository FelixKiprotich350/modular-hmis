import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Role Privileges')
@Controller('api/roleprivileges')
export class RoleprivilegesController {
  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  getRoles() {
    return { message: 'Roles list', roles: [] };
  }

  @Post('roles')
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  createRole(@Body() createRoleDto: any) {
    return { message: 'Role created', role: createRoleDto };
  }

  @Get('privileges')
  @ApiOperation({ summary: 'Get all privileges' })
  @ApiResponse({ status: 200, description: 'List of privileges' })
  getPrivileges() {
    return { message: 'Privileges list', privileges: [] };
  }

  @Post('privileges')
  @ApiOperation({ summary: 'Create privilege' })
  @ApiResponse({ status: 201, description: 'Privilege created' })
  createPrivilege(@Body() createPrivilegeDto: any) {
    return { message: 'Privilege created', privilege: createPrivilegeDto };
  }

  @Post('roles/:roleId/privileges/:privilegeId')
  @ApiOperation({ summary: 'Assign privilege to role' })
  assignPrivilege(@Param('roleId') roleId: string, @Param('privilegeId') privilegeId: string) {
    return { message: `Privilege ${privilegeId} assigned to role ${roleId}` };
  }

  @Delete('roles/:roleId/privileges/:privilegeId')
  @ApiOperation({ summary: 'Remove privilege from role' })
  removePrivilege(@Param('roleId') roleId: string, @Param('privilegeId') privilegeId: string) {
    return { message: `Privilege ${privilegeId} removed from role ${roleId}` };
  }
}