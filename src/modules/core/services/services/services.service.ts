import { PrismaClient } from '@prisma/client';
import { CreateServiceDto, UpdateServiceDto } from '../dto/create-service.dto';

export class ServicesService {
  constructor(private db: PrismaClient) {}

  async createService(data: CreateServiceDto): Promise<any> {
    return await this.db.service.create({
      data: {
        ...data,
        active: data.active ?? true
      }
    });
  }

  async getService(id: string): Promise<any> {
    return await this.db.service.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
  }

  async getServiceByCode(code: string): Promise<any> {
    return await this.db.service.findUnique({
      where: { code },
      include: {
        category: true
      }
    });
  }

  async listServices(categoryId?: string): Promise<any[]> {
    return await this.db.service.findMany({
      where: {
        active: true,
        ...(categoryId && { categoryId })
      },
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    });
  }

  async getServicesByCategory(categoryId: string): Promise<any[]> {
    return await this.db.service.findMany({
      where: { categoryId, active: true },
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    });
  }

  async updateService(id: string, data: UpdateServiceDto): Promise<any> {
    return await this.db.service.update({
      where: { id },
      data
    });
  }

  async deactivateService(id: string): Promise<any> {
    return await this.db.service.update({
      where: { id },
      data: { active: false }
    });
  }

  async searchServices(query: string): Promise<any[]> {
    return await this.db.service.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    });
  }

  async getServiceCategories(): Promise<any[]> {
    return await this.db.serviceCategory.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });
  }
}