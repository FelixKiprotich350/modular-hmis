import { Controller, Post, Body, Get, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { PrismaService } from '../../../core/prisma.service';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  private authService: AuthService;

  constructor(private prisma: PrismaService) {
    this.authService = new AuthService(prisma);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: { username: string; password: string }) {
    const result = await this.authService.login(loginDto);
    if (!result) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return result;
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  async logout(@Headers('authorization') token: string) {
    await this.authService.logout(token);
    return { message: 'Logout successful' };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  async getCurrentUser(@Headers('authorization') token: string) {
    if (!token) {
      throw new HttpException('Token required', HttpStatus.UNAUTHORIZED);
    }
    
    const cleanToken = token.replace('Bearer ', '');
    const payload = await this.authService.validateToken(cleanToken);
    
    if (!payload) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    
    return { user: payload };
  }
}