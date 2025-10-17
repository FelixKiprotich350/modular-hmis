import { Controller, Post, Body, Get, Headers, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { PrismaService } from '../../../core/prisma.service';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { User } from '../../../core/decorators/user.decorator';

class LoginDto {
  username: string;
  password: string;
}

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
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user info' })
  async getCurrentUser(@User() user: any) {
    return { user };
  }
}