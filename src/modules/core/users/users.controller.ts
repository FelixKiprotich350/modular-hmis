import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { PrismaService } from '../../../core/prisma.service';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { TransactionService } from '../../../core/transaction.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserWithRolesDto } from './dto/create-user-with-roles.dto';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class UsersController {
  private userService: UserService;

  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService
  ) {
    this.userService = new UserService(prisma);
  }

  @Post()
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.username || !createUserDto.email || !createUserDto.password) {
      throw new HttpException('Username, email, and password are required', HttpStatus.BAD_REQUEST);
    }
    
    try {
      const user = await this.userService.createUser(createUserDto);
      return { message: 'User created', user };
    } catch (error) {
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll() {
    const users = await this.userService.listUsers();
    return { message: 'Users list', users };
  }

  @Get(':id')
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.getUser(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { user };
  }

  @Patch(':id')
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.updateUser(id, updateUserDto);
      return { message: `User ${id} updated`, user };
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async remove(@Param('id') id: string) {
    try {
      await this.userService.deleteUser(id);
      return { message: `User ${id} deleted` };
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post(':id/roles')
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: 200, description: 'Role assigned' })
  @ApiBody({ type: AssignRoleDto })
  async assignRole(@Param('id') id: string, @Body() roleDto: AssignRoleDto) {
    const success = await this.userService.assignRole(id, roleDto.role);
    if (!success) {
      throw new HttpException('Failed to assign role', HttpStatus.BAD_REQUEST);
    }
    return { message: `Role ${roleDto.role} assigned to user ${id}` };
  }

  @Delete(':id/roles/:role')
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiResponse({ status: 200, description: 'Role removed' })
  async removeRole(@Param('id') id: string, @Param('role') role: string) {
    const success = await this.userService.removeRole(id, role);
    if (!success) {
      throw new HttpException('Failed to remove role', HttpStatus.BAD_REQUEST);
    }
    return { message: `Role ${role} removed from user ${id}` };
  }

  @Post('with-roles')
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Create user with multiple roles (transactional)' })
  @ApiResponse({ status: 201, description: 'User created with roles' })
  @ApiBody({ type: CreateUserWithRolesDto })
  async createUserWithRoles(@Body() createUserDto: CreateUserWithRolesDto) {
    try {
      const user = await this.userService.createUserWithRoles(
        {
          username: createUserDto.username,
          email: createUserDto.email,
          password: createUserDto.password
        },
        createUserDto.roles
      );
      return { message: 'User created with roles', user };
    } catch (error) {
      throw new HttpException('Failed to create user with roles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}