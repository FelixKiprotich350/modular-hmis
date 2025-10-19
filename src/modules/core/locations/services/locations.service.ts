import { PrismaClient } from '@prisma/client';
import { Location, LocationTag, LocationAttribute } from '../models/location.model';

export class LocationService {
  constructor(private db: PrismaClient) {}

  async createLocation(data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.location.create({
      data
    });
  }

  async getLocation(id: string): Promise<any> {
    return await this.db.location.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true
      }
    });
  }

  async getLocationHierarchy(id: string): Promise<any[]> {
    const location = await this.db.location.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true
      }
    });
    
    if (!location) return [];
    
    const hierarchy: any[] = [location];
    let current = location.parent;
    while (current) {
      hierarchy.unshift(current);
      if (current.parentLocationId) {
        current = await this.db.location.findUnique({
          where: { id: current.parentLocationId },
          include: { parent: true }
        });
      } else {
        current = null;
      }
    }
    
    return hierarchy;
  }

  async getChildLocations(parentId: string): Promise<any[]> {
    return await this.db.location.findMany({
      where: {
        parentLocationId: parentId,
        retired: false
      }
    });
  }

  async searchLocations(query: string): Promise<any[]> {
    return await this.db.location.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } }
        ],
        retired: false
      }
    });
  }

  async getLocationsByTag(tagId: string): Promise<any[]> {
    return [];
  }

  async addLocationAttribute(locationId: string, attributeTypeId: string, value: string): Promise<LocationAttribute> {
    return {
      id: 'attr_' + Date.now(),
      locationId,
      attributeTypeId,
      value,
      createdAt: new Date()
    };
  }

  async getLocationAttributes(locationId: string): Promise<LocationAttribute[]> {
    return [];
  }

  async getLocationTags(): Promise<LocationTag[]> {
    return [
      { id: '1', name: 'Hospital', description: 'Hospital facility', retired: false },
      { id: '2', name: 'Clinic', description: 'Outpatient clinic', retired: false },
      { id: '3', name: 'Pharmacy', description: 'Pharmacy location', retired: false },
      { id: '4', name: 'Laboratory', description: 'Laboratory facility', retired: false }
    ];
  }

  async retireLocation(locationId: string, reason?: string): Promise<any> {
    return await this.db.location.update({
      where: { id: locationId },
      data: { retired: true }
    });
  }

  async listLocations(): Promise<any[]> {
    return await this.db.location.findMany({
      where: { retired: false },
      include: {
        parent: true
      }
    });
  }

  async updateLocation(id: string, data: Partial<Location>): Promise<any> {
    return await this.db.location.update({
      where: { id },
      data
    });
  }

  async deleteLocation(id: string): Promise<boolean> {
    await this.db.location.delete({ where: { id } });
    return true;
  }
}