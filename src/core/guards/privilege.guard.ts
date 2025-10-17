import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleprivilegeService } from '../../modules/core/roleprivileges/services/roleprivilege.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrivilegeGuard implements CanActivate {
  private rolePrivilegeService: RoleprivilegeService;

  constructor(private reflector: Reflector, private prisma: PrismaService) {
    this.rolePrivilegeService = new RoleprivilegeService(prisma);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPrivileges = this.reflector.get<string[]>('privileges', context.getHandler());
    if (!requiredPrivileges) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    for (const privilege of requiredPrivileges) {
      const hasPermission = await this.rolePrivilegeService.checkPermission(user.userId, privilege);
      if (!hasPermission) {
        throw new ForbiddenException(`Insufficient privileges: ${privilege}`);
      }
    }

    return true;
  }
}