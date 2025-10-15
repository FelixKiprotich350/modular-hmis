import { PrismaClient } from '@prisma/client';

export class UserService {
  constructor(private db: PrismaClient) {}

  async createUser(data: any) {
    return { id: 'user_' + Date.now(), ...data };
  }

  async getUser(id: string) {
    return await this.db.user.findUnique({ where: { id } });
  }

  async listUsers() {
    return await this.db.user.findMany();
  }
}