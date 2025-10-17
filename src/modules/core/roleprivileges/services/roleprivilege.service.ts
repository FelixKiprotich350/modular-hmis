import { PrismaClient } from '@prisma/client';

export interface Role {
  id: string;
  name: string;
  privileges: string[];
}

export interface Privilege {
  id: string;
  name: string;
}

export class RoleprivilegeService {
  constructor(private db: PrismaClient) {}

  async createRole(data: { name: string }): Promise<Role> {
    const role = await this.db.role.create({
      data: { name: data.name },
      include: {
        privileges: {
          include: { privilege: true }
        }
      }
    });

    return {
      id: role.id,
      name: role.name,
      privileges: role.privileges.map(rp => rp.privilege.name)
    };
  }

  async createPrivilege(data: { name: string }): Promise<Privilege> {
    const privilege = await this.db.privilege.create({
      data: { name: data.name }
    });

    return {
      id: privilege.id,
      name: privilege.name
    };
  }

  async assignPrivilegeToRole(roleId: string, privilegeId: string): Promise<boolean> {
    await this.db.rolePrivilege.upsert({
      where: {
        roleId_privilegeId: {
          roleId,
          privilegeId
        }
      },
      create: {
        roleId,
        privilegeId
      },
      update: {}
    });
    return true;
  }

  async removePrivilegeFromRole(roleId: string, privilegeId: string): Promise<boolean> {
    await this.db.rolePrivilege.delete({
      where: {
        roleId_privilegeId: {
          roleId,
          privilegeId
        }
      }
    });
    return true;
  }

  async getRoles(): Promise<Role[]> {
    const roles = await this.db.role.findMany({
      include: {
        privileges: {
          include: { privilege: true }
        }
      }
    });

    return roles.map(role => ({
      id: role.id,
      name: role.name,
      privileges: role.privileges.map(rp => rp.privilege.name)
    }));
  }

  async getPrivileges(): Promise<Privilege[]> {
    const privileges = await this.db.privilege.findMany();
    return privileges.map(p => ({
      id: p.id,
      name: p.name
    }));
  }

  async getRolePrivileges(roleId: string): Promise<Privilege[]> {
    const rolePrivileges = await this.db.rolePrivilege.findMany({
      where: { roleId },
      include: { privilege: true }
    });

    return rolePrivileges.map(rp => ({
      id: rp.privilege.id,
      name: rp.privilege.name
    }));
  }

  async checkPermission(userId: string, privilegeName: string): Promise<boolean> {
    const userRoles = await this.db.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            privileges: {
              include: { privilege: true }
            }
          }
        }
      }
    });

    return userRoles.some(ur => 
      ur.role.privileges.some(rp => rp.privilege.name === privilegeName)
    );
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.db.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            privileges: {
              include: { privilege: true }
            }
          }
        }
      }
    });

    return userRoles.map(ur => ({
      id: ur.role.id,
      name: ur.role.name,
      privileges: ur.role.privileges.map(rp => rp.privilege.name)
    }));
  }
}