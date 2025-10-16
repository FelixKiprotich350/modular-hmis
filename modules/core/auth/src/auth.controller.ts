import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() loginDto: any) {
    return { message: 'Login endpoint', token: 'mock-jwt-token' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  logout() {
    return { message: 'Logout successful' };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  getProfile() {
    return { message: 'User profile', user: null };
  }
}