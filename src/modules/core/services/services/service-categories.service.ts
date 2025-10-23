import { PrismaClient } from '@prisma/client';
import { CreateServiceCategoryDto, UpdateServiceCategoryDto } from '../dto/create-service-category.dto';

export class ServiceCategoriesService {
  constructor(private db: PrismaClient) {}

  async createServiceCategory(data: CreateServiceCategoryDto): Promise<any> {
    return await this.db.serviceCategory.create({
      data: {
        ...data,
        active: data.active ?? true
      }
    });
  }

  async getServiceCategory(id: string): Promise<any> {
    return await this.db.serviceCategory.findUnique({
      where: { id },
      include: {
        services: {
          where: { active: true },
          orderBy: { name: 'asc' }
        }
      }
    });
  }

  async getServiceCategoryByCode(code: string): Promise<any> {
    return await this.db.serviceCategory.findUnique({
      where: { code },
      include: {
        services: {
          where: { active: true },
          orderBy: { name: 'asc' }
        }
      }
    });
  }

  async listServiceCategories(): Promise<any[]> {
    return await this.db.serviceCategory.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { services: { where: { active: true } } }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async updateServiceCategory(id: string, data: UpdateServiceCategoryDto): Promise<any> {
    return await this.db.serviceCategory.update({
      where: { id },
      data
    });
  }

  async deactivateServiceCategory(id: string): Promise<any> {
    return await this.db.serviceCategory.update({
      where: { id },
      data: { active: false }
    });
  }

  async searchServiceCategories(query: string): Promise<any[]> {
    return await this.db.serviceCategory.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { name: 'asc' }
    });
  }
}