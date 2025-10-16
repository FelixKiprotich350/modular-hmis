import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  register(@Body() createUserDto: any) {
    return { message: 'User registered', user: createUserDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return { message: 'Users list', users: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return { message: `User ${id}`, user: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return { message: `User ${id} updated`, user: updateUserDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return { message: `User ${id} deleted` };
  }
}