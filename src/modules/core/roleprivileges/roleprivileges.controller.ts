import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleprivilegeService } from './services/roleprivilege.service';
import { PrismaService } from '../../../core/prisma.service';

@ApiTags('Role Privileges')
@Controller('api/roleprivileges')
export class RoleprivilegesController {
  private rolePrivilegeService: RoleprivilegeService;

  constructor(private prisma: PrismaService) {
    this.rolePrivilegeService = new RoleprivilegeService(prisma);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  async getRoles() {
    const roles = await this.rolePrivilegeService.getRoles();
    return { roles };
  }

  @Post('roles')
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createRole(@Body() createRoleDto: { name: string }) {
    if (!createRoleDto.name) {
      throw new HttpException('Role name is required', HttpStatus.BAD_REQUEST);
    }
    
    const role = await this.rolePrivilegeService.createRole(createRoleDto);
    return { message: 'Role created', role };
  }

  @Get('privileges')
  @ApiOperation({ summary: 'Get all privileges' })
  @ApiResponse({ status: 200, description: 'List of privileges' })
  async getPrivileges() {
    const privileges = await this.rolePrivilegeService.getPrivileges();
    return { privileges };
  }

  @Post('privileges')
  @ApiOperation({ summary: 'Create privilege' })
  @ApiResponse({ status: 201, description: 'Privilege created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createPrivilege(@Body() createPrivilegeDto: { name: string }) {
    if (!createPrivilegeDto.name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }
    
    const privilege = await this.rolePrivilegeService.createPrivilege(createPrivilegeDto);
    return { message: 'Privilege created', privilege };
  }

  @Post('roles/:roleId/privileges/:privilegeId')
  @ApiOperation({ summary: 'Assign privilege to role' })
  @ApiResponse({ status: 200, description: 'Privilege assigned' })
  async assignPrivilege(@Param('roleId') roleId: string, @Param('privilegeId') privilegeId: string) {
    await this.rolePrivilegeService.assignPrivilegeToRole(roleId, privilegeId);
    return { message: `Privilege ${privilegeId} assigned to role ${roleId}` };
  }

  @Delete('roles/:roleId/privileges/:privilegeId')
  @ApiOperation({ summary: 'Remove privilege from role' })
  @ApiResponse({ status: 200, description: 'Privilege removed' })
  async removePrivilege(@Param('roleId') roleId: string, @Param('privilegeId') privilegeId: string) {
    await this.rolePrivilegeService.removePrivilegeFromRole(roleId, privilegeId);
    return { message: `Privilege ${privilegeId} removed from role ${roleId}` };
  }

  @Get('roles/:roleId/privileges')
  @ApiOperation({ summary: 'Get role privileges' })
  @ApiResponse({ status: 200, description: 'Role privileges' })
  async getRolePrivileges(@Param('roleId') roleId: string) {
    const privileges = await this.rolePrivilegeService.getRolePrivileges(roleId);
    return { roleId, privileges };
  }

  @Post('check-permission')
  @ApiOperation({ summary: 'Check user permission' })
  @ApiResponse({ status: 200, description: 'Permission check result' })
  async checkPermission(@Body() permissionDto: { userId: string; privilegeName: string }) {
    const hasPermission = await this.rolePrivilegeService.checkPermission(
      permissionDto.userId, 
      permissionDto.privilegeName
    );
    
    return {
      userId: permissionDto.userId,
      privilegeName: permissionDto.privilegeName,
      hasPermission
    };
  }
}