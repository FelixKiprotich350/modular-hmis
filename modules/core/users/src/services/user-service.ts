import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private db: PrismaClient) {}

  async createUser(data: { username: string; email: string; password: string; firstName?: string; lastName?: string }) {
    // Check if user already exists
    const existingUser = await this.db.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email }
        ]
      }
    });

    if (existingUser) {
      throw new Error('User with this username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.db.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  }

  async getUser(id: string) {
    return await this.db.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getUserByUsername(username: string) {
    return await this.db.user.findUnique({ where: { username } });
  }

  async listUsers() {
    return await this.db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async updateUser(id: string, data: { email?: string; firstName?: string; lastName?: string }) {
    const user = await this.db.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return user;
  }

  async deleteUser(id: string) {
    // Remove user roles first
    await this.db.userRole.deleteMany({ where: { userId: id } });
    
    // Delete user
    await this.db.user.delete({ where: { id } });
  }
}