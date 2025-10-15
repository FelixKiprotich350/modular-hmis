import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrivilegeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private db: PrismaClient
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPrivileges = this.reflector.get<string[]>('privileges', context.getHandler());
    
    if (!requiredPrivileges) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    return await this.hasPrivilege(user.id, requiredPrivileges);
  }

  private async hasPrivilege(userId: string, privileges: string[]): Promise<boolean> {
    const userPrivileges = await this.db.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                privileges: {
                  include: {
                    privilege: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!userPrivileges) {
      return false;
    }

    const userPrivilegeNames = userPrivileges.roles
      .flatMap(ur => ur.role.privileges)
      .map(rp => rp.privilege.name);

    return privileges.every(privilege => userPrivilegeNames.includes(privilege));
  }
}

export const Privileges = (...privileges: string[]) => SetMetadata('privileges', privileges);