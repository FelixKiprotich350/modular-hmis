import { PrismaClient } from '@prisma/client';

export class RoleManagementService {
  constructor(private db: PrismaClient) {}

  async getAllRoles() {
    return await this.db.role.findMany({
      select: {
        id: true,
        name: true,
        privileges: {
          include: {
            privilege: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
  }

  async getRolePrivileges(roleName: string) {
    const role = await this.db.role.findUnique({
      where: { name: roleName },
      include: {
        privileges: {
          include: {
            privilege: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }

    return role.privileges.map(rp => rp.privilege.name);
  }

  async createRole(name: string, description?: string) {
    return await this.db.role.create({
      data: { name }
    });
  }

  async deleteRole(roleName: string) {
    const role = await this.db.role.findUnique({ where: { name: roleName } });
    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }

    // Remove all user assignments first
    await this.db.userRole.deleteMany({
      where: { roleId: role.id }
    });

    // Remove all privilege assignments
    await this.db.rolePrivilege.deleteMany({
      where: { roleId: role.id }
    });

    // Delete the role
    await this.db.role.delete({
      where: { id: role.id }
    });
  }
}