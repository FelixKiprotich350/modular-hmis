import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() loginDto: any) {
    return { message: 'Login endpoint', token: 'mock_token' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  logout(@Headers('authorization') token: string) {
    return { message: 'Logout successful' };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  getCurrentUser(@Headers('authorization') token: string) {
    return { message: 'Current user info' };
  }
}