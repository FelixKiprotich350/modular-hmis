import { PrismaClient } from '@prisma/client';

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProviderService {
  constructor(private db: PrismaClient) {}

  async createProvider(data: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider> {
    return {
      id: 'provider_' + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getProvider(id: string): Promise<Provider | null> {
    return null;
  }

  async listProviders(): Promise<Provider[]> {
    return [];
  }

  async updateProvider(id: string, data: Partial<Provider>): Promise<Provider | null> {
    return null;
  }

  async deleteProvider(id: string): Promise<boolean> {
    return true;
  }
}