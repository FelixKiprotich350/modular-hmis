import { PrismaClient } from '@prisma/client';
import { Provider, ProviderAttribute, ProviderRole, ProviderManagement, Person } from '../models/provider.model';

export class ProviderService {
  constructor(private db: PrismaClient) {}

  async createProvider(personData: Omit<Person, 'id'>, identifier?: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const person = await tx.person.create({
        data: personData
      });

      return await tx.provider.create({
        data: {
          personId: person.id,
          identifier: identifier || `PROV${Date.now()}`,
          name: `${personData.firstName} ${personData.lastName}`,
          retired: false
        },
        include: {
          person: true
        }
      });
    });
  }

  async getProvider(id: string): Promise<any> {
    return await this.db.provider.findUnique({
      where: { id },
      include: {
        person: true
      }
    });
  }

  async getProviderByIdentifier(identifier: string): Promise<any> {
    return await this.db.provider.findUnique({
      where: { identifier },
      include: {
        person: true
      }
    });
  }

  async searchProviders(query: string): Promise<any[]> {
    return await this.db.provider.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { identifier: { contains: query, mode: 'insensitive' } },
          { person: {
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } }
            ]
          }}
        ],
        retired: false
      },
      include: {
        person: true
      }
    });
  }

  async addProviderAttribute(providerId: string, attributeTypeId: string, value: string): Promise<ProviderAttribute> {
    return {
      id: 'attr_' + Date.now(),
      providerId,
      attributeTypeId,
      value,
      createdAt: new Date()
    };
  }

  async getProviderAttributes(providerId: string): Promise<ProviderAttribute[]> {
    return [];
  }

  async assignProviderRole(providerId: string, roleId: string, locationId?: string): Promise<ProviderManagement> {
    return {
      id: 'mgmt_' + Date.now(),
      providerId,
      providerRoleId: roleId,
      locationId,
      startDate: new Date(),
      createdAt: new Date()
    };
  }

  async getProvidersByRole(roleId: string): Promise<any[]> {
    return [];
  }

  async getProviderRoles(): Promise<ProviderRole[]> {
    return [
      { id: '1', role: 'Doctor', description: 'Medical Doctor', retired: false },
      { id: '2', role: 'Nurse', description: 'Registered Nurse', retired: false },
      { id: '3', role: 'Pharmacist', description: 'Licensed Pharmacist', retired: false },
      { id: '4', role: 'Lab Technician', description: 'Laboratory Technician', retired: false }
    ];
  }

  async getProvidersByLocation(locationId: string): Promise<any[]> {
    return [];
  }

  async retireProvider(providerId: string, reason?: string): Promise<any> {
    return await this.db.provider.update({
      where: { id: providerId },
      data: { retired: true }
    });
  }

  async listProviders(): Promise<any[]> {
    return await this.db.provider.findMany({
      where: { retired: false },
      include: {
        person: true
      }
    });
  }

  async updateProvider(id: string, data: Partial<Provider>): Promise<any> {
    return await this.db.provider.update({
      where: { id },
      data,
      include: {
        person: true
      }
    });
  }

  async deleteProvider(id: string): Promise<boolean> {
    await this.db.provider.delete({ where: { id } });
    return true;
  }
}