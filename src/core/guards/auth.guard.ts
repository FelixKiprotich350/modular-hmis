import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../modules/core/auth/services/auth.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private authService: AuthService;

  constructor(private prisma: PrismaService) {
    this.authService = new AuthService(prisma);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Access token required');
    }

    try {
      const payload = await this.authService.validateToken(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}