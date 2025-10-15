import { PrismaClient } from '@prisma/client';

export class PrivilegeService {
  constructor(private db: PrismaClient) {}

  async hasPrivilege(userId: string, privilegeName: string): Promise<boolean> {
    try {
      const result = await this.db.$queryRaw`
        SELECT COUNT(*) as count
        FROM "User" u
        JOIN "UserRole" ur ON u.id = ur."userId"
        JOIN "Role" r ON ur."roleId" = r.id
        JOIN "RolePrivilege" rp ON r.id = rp."roleId"
        JOIN "Privilege" p ON rp."privilegeId" = p.id
        WHERE u.id = ${userId} AND p.name = ${privilegeName}
      `;
      
      return Number((result as any[])[0]?.count || 0) > 0;
    } catch (error) {
      console.error('Error checking privilege:', error);
      return false;
    }
  }

  async hasAnyPrivilege(userId: string, privilegeNames: string[]): Promise<boolean> {
    if (privilegeNames.length === 0) return true;
    
    for (const privilege of privilegeNames) {
      if (await this.hasPrivilege(userId, privilege)) {
        return true;
      }
    }
    return false;
  }

  async hasAllPrivileges(userId: string, privilegeNames: string[]): Promise<boolean> {
    if (privilegeNames.length === 0) return true;
    
    for (const privilege of privilegeNames) {
      if (!(await this.hasPrivilege(userId, privilege))) {
        return false;
      }
    }
    return true;
  }

  async getUserPrivileges(userId: string): Promise<string[]> {
    try {
      const result = await this.db.$queryRaw`
        SELECT DISTINCT p.name
        FROM "User" u
        JOIN "UserRole" ur ON u.id = ur."userId"
        JOIN "Role" r ON ur."roleId" = r.id
        JOIN "RolePrivilege" rp ON r.id = rp."roleId"
        JOIN "Privilege" p ON rp."privilegeId" = p.id
        WHERE u.id = ${userId}
      `;
      
      return (result as any[]).map(row => row.name);
    } catch (error) {
      console.error('Error getting user privileges:', error);
      return [];
    }
  }

  async getUserRoles(userId: string): Promise<string[]> {
    try {
      const result = await this.db.$queryRaw`
        SELECT r.name
        FROM "User" u
        JOIN "UserRole" ur ON u.id = ur."userId"
        JOIN "Role" r ON ur."roleId" = r.id
        WHERE u.id = ${userId}
      `;
      
      return (result as any[]).map(row => row.name);
    } catch (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
  }

  async assignRoleToUser(userId: string, roleName: string): Promise<void> {
    try {
      const role = await this.db.role.findUnique({ where: { name: roleName } });
      if (!role) {
        throw new Error(`Role '${roleName}' not found`);
      }

      await this.db.userRole.create({
        data: {
          userId,
          roleId: role.id
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('User already has this role');
      }
      throw error;
    }
  }

  async removeRoleFromUser(userId: string, roleName: string): Promise<void> {
    const role = await this.db.role.findUnique({ where: { name: roleName } });
    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }

    await this.db.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id
        }
      }
    });
  }
}