import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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
  constructor(private db: PrismaClient) {}

  async createUser(data: CreateUserRequest): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await this.db.user.create({
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

  async deleteUser(id: string): Promise<boolean> {
    await this.db.user.delete({ where: { id } });
    return true;
  }

  async assignRole(userId: string, roleName: string): Promise<boolean> {
    const role = await this.db.role.findUnique({ where: { name: roleName } });
    if (!role) return false;

    await this.db.userRole.upsert({
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

  async removeRole(userId: string, roleName: string): Promise<boolean> {
    const role = await this.db.role.findUnique({ where: { name: roleName } });
    if (!role) return false;

    await this.db.userRole.delete({
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