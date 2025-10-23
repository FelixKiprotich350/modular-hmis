import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from "@nestjs/swagger";
import { RoleprivilegeService } from "./services/roleprivilege.service";
import { PrismaService } from "../../../core/prisma.service";
import { AuthGuard } from "../../../core/guards/auth.guard";
import { PrivilegeGuard } from "../../../core/guards/privilege.guard";
import { Privileges } from "../../../core/decorators/privileges.decorator";
import { TransactionService } from "../../../core/transaction.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { CreatePrivilegeDto } from "./dto/create-privilege.dto";
import { CheckPermissionDto } from "./dto/check-permission.dto";
import { CreateRoleWithPrivilegesDto } from "./dto/create-role-with-privileges.dto";

@ApiTags("Role Privileges")
@Controller({ path: "roleprivileges", version: "1" })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class RoleprivilegesController {
  private rolePrivilegeService: RoleprivilegeService;

  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService
  ) {
    this.rolePrivilegeService = new RoleprivilegeService(prisma);
  }

  @Get("roles")
  @Privileges("manage_roles")
  @ApiOperation({ summary: "Get all roles" })
  @ApiResponse({ status: 200, description: "List of roles" })
  async getRoles() {
    const roles = await this.rolePrivilegeService.getRoles();
    return { roles };
  }

  @Post("roles")
  @Privileges("manage_roles")
  @ApiOperation({ summary: "Create role" })
  @ApiResponse({ status: 201, description: "Role created" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiBody({ type: CreateRoleDto })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    if (!createRoleDto.name) {
      throw new HttpException("Role name is required", HttpStatus.BAD_REQUEST);
    }

    const role = await this.rolePrivilegeService.createRole(createRoleDto);
    return role;
  }

  @Get("privileges")
  @Privileges("manage_roles")
  @ApiOperation({ summary: "Get all privileges" })
  @ApiResponse({ status: 200, description: "List of privileges" })
  async getPrivileges() {
    const privileges = await this.rolePrivilegeService.getPrivileges();
    return { privileges };
  }

  @Post("privileges")
  @Privileges("manage_roles")
  @ApiOperation({ summary: "Create privilege" })
  @ApiResponse({ status: 201, description: "Privilege created" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiBody({ type: CreatePrivilegeDto })
  async createPrivilege(@Body() createPrivilegeDto: CreatePrivilegeDto) {
    if (!createPrivilegeDto.name) {
      throw new HttpException("Name is required", HttpStatus.BAD_REQUEST);
    }

    const privilege = await this.rolePrivilegeService.createPrivilege(
      createPrivilegeDto
    );
    return privilege;
  }

  @Post("roles/:roleId/privileges/:privilegeId")
  @Privileges("manage_roles")
  @ApiOperation({ summary: "Assign privilege to role" })
  @ApiResponse({ status: 200, description: "Privilege assigned" })
  async assignPrivilege(
    @Param("roleId") roleId: string,
    @Param("privilegeId") privilegeId: string
  ) {
    await this.rolePrivilegeService.assignPrivilegeToRole(roleId, privilegeId);
    return { message: `Privilege ${privilegeId} assigned to role ${roleId}` };
  }

  @Delete("roles/:roleId/privileges/:privilegeId")
  @Privileges("manage_roles")
  @ApiOperation({ summary: "Remove privilege from role" })
  @ApiResponse({ status: 200, description: "Privilege removed" })
  async removePrivilege(
    @Param("roleId") roleId: string,
    @Param("privilegeId") privilegeId: string
  ) {
    await this.rolePrivilegeService.removePrivilegeFromRole(
      roleId,
      privilegeId
    );
    return { message: `Privilege ${privilegeId} removed from role ${roleId}` };
  }

  @Get("roles/:roleId/privileges")
  @Privileges("manage_roles")
  @ApiOperation({ summary: "Get role privileges" })
  @ApiResponse({ status: 200, description: "Role privileges" })
  async getRolePrivileges(@Param("roleId") roleId: string) {
    const privileges = await this.rolePrivilegeService.getRolePrivileges(
      roleId
    );
    return { roleId, privileges };
  }

  @Post("check-permission")
  @Privileges("manage_roles")
  @ApiOperation({ summary: "Check user permission" })
  @ApiResponse({ status: 200, description: "Permission check result" })
  @ApiBody({ type: CheckPermissionDto })
  async checkPermission(@Body() permissionDto: CheckPermissionDto) {
    const hasPermission = await this.rolePrivilegeService.checkPermission(
      permissionDto.userId,
      permissionDto.privilegeName
    );

    return {
      userId: permissionDto.userId,
      privilegeName: permissionDto.privilegeName,
      hasPermission,
    };
  }

  @Post("roles-with-privileges")
  @Privileges("manage_roles")
  @ApiOperation({ summary: "Create role with privileges (transactional)" })
  @ApiResponse({ status: 201, description: "Role created with privileges" })
  @ApiBody({ type: CreateRoleWithPrivilegesDto })
  async createRoleWithPrivileges(
    @Body() createRoleDto: CreateRoleWithPrivilegesDto
  ) {
    try {
      const role = await this.rolePrivilegeService.createRoleWithPrivileges(
        createRoleDto.name,
        createRoleDto.privilegeIds
      );
      return role;
    } catch (error) {
      throw new HttpException(
        "Failed to create role with privileges",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
