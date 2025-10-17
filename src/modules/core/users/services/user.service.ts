import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuditService } from '../../audit/services/audit.service';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roles?: string[];
}

export class UserService {
  private auditService: AuditService;

  constructor(private db: PrismaClient) {
    this.auditService = new AuditService(db);
  }

  async createUser(data: CreateUserRequest, tx?: any, auditData?: { userId?: string; ip?: string }): Promise<User> {
    const db = tx || this.db;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await db.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        roles: {
          create: (data.roles || ['user']).map(roleName => ({
            role: {
              connectOrCreate: {
                where: { name: roleName },
                create: { name: roleName }
              }
            }
          }))
        }
      },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    // Audit log
    if (auditData) {
      await this.auditService.log({
        userId: auditData.userId,
        action: 'CREATE_USER',
        resource: 'users',
        resourceId: user.id,
        details: { username: data.username, email: data.email, roles: data.roles },
        ipAddress: auditData.ip
      }, tx);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(ur => ur.role.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async getUser(id: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(ur => ur.role.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(ur => ur.role.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async getUserWithPassword(username: string) {
    return this.db.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });
  }

  async listUsers(): Promise<User[]> {
    const users = await this.db.user.findMany({
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(ur => ur.role.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  async updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'roles'>>): Promise<User | null> {
    const user = await this.db.user.update({
      where: { id },
      data,
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(ur => ur.role.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async deleteUser(id: string, tx?: any, auditData?: { userId?: string; ip?: string }): Promise<boolean> {
    const db = tx || this.db;
    
    // Get user info before deletion for audit
    const userToDelete = await db.user.findUnique({ where: { id } });
    
    await db.user.delete({ where: { id } });
    
    // Audit log
    if (auditData && userToDelete) {
      await this.auditService.log({
        userId: auditData.userId,
        action: 'DELETE_USER',
        resource: 'users',
        resourceId: id,
        details: { deletedUsername: userToDelete.username },
        ipAddress: auditData.ip
      }, tx);
    }
    
    return true;
  }

  async createUserWithRoles(userData: CreateUserRequest, roleNames: string[]): Promise<User> {
    return this.db.$transaction(async (tx) => {
      const user = await this.createUser(userData, tx);
      
      for (const roleName of roleNames) {
        await this.assignRole(user.id, roleName, tx);
      }
      
      return this.getUser(user.id);
    });
  }

  async assignRole(userId: string, roleName: string, tx?: any): Promise<boolean> {
    const db = tx || this.db;
    const role = await db.role.findUnique({ where: { name: roleName } });
    if (!role) return false;

    await db.userRole.upsert({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id
        }
      },
      create: {
        userId,
        roleId: role.id
      },
      update: {}
    });
    
    return true;
  }

  async removeRole(userId: string, roleName: string, tx?: any): Promise<boolean> {
    const db = tx || this.db;
    const role = await db.role.findUnique({ where: { name: roleName } });
    if (!role) return false;

    await db.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId: role.id
        }
      }
    });
    
    return true;
  }
}