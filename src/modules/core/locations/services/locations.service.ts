import { PrismaClient } from '@prisma/client';
import { Location, LocationTag, LocationAttribute } from '../models/location.model';

export class LocationService {
  constructor(private db: PrismaClient) {}

  // Facility Management
  async createFacility(data: {
    name: string;
    description?: string;
    address?: string;
    cityVillage?: string;
    stateProvince?: string;
    country?: string;
    postalCode?: string;
    phone?: string;
  }): Promise<any> {
    return await this.db.facility.create({ data });
  }

  async getFacility(id: string): Promise<any> {
    return await this.db.facility.findUnique({
      where: { id },
      include: {
        departments: true,
        locations: {
          include: {
            servicePoints: true,
            children: true
          }
        }
      }
    });
  }

  async listFacilities(): Promise<any[]> {
    return await this.db.facility.findMany({
      where: { retired: false },
      include: {
        departments: true,
        locations: true
      }
    });
  }

  // Department Management
  async createDepartment(data: {
    facilityId: string;
    name: string;
    description?: string;
  }): Promise<any> {
    return await this.db.department.create({ data });
  }

  async getFacilityDepartments(facilityId: string): Promise<any[]> {
    return await this.db.department.findMany({
      where: { facilityId, retired: false }
    });
  }

  async updateDepartment(id: string, data: { name?: string; description?: string }): Promise<any> {
    return await this.db.department.update({
      where: { id },
      data
    });
  }

  // Service Point Management
  async createServicePoint(data: {
    locationId: string;
    name: string;
    description?: string;
    serviceType: string;
  }): Promise<any> {
    return await this.db.servicePoint.create({ data });
  }

  async addServiceToServicePoint(servicePointId: string, serviceId: string): Promise<any> {
    return await this.db.servicePointService.create({
      data: {
        servicePointId,
        serviceId
      }
    });
  }

  async removeServiceFromServicePoint(servicePointId: string, serviceId: string): Promise<any> {
    return await this.db.servicePointService.delete({
      where: {
        servicePointId_serviceId: {
          servicePointId,
          serviceId
        }
      }
    });
  }

  async getServicePointServices(servicePointId: string): Promise<any[]> {
    return await this.db.servicePointService.findMany({
      where: { servicePointId, active: true },
      include: {
        service: true
      }
    });
  }

  async getLocationServicePoints(locationId: string): Promise<any[]> {
    return await this.db.servicePoint.findMany({
      where: { locationId, retired: false },
      include: {
        services: {
          where: { active: true },
          include: {
            service: true
          }
        }
      }
    });
  }

  async updateServicePoint(id: string, data: { name?: string; description?: string; serviceType?: string }): Promise<any> {
    return await this.db.servicePoint.update({
      where: { id },
      data
    });
  }

  async createLocation(data: {
    facilityId: string;
    name: string;
    description?: string;
    locationLevel: string;
    parentLocationId?: string;
  }): Promise<any> {
    return await this.db.location.create({ data });
  }

  async getLocation(id: string): Promise<any> {
    return await this.db.location.findUnique({
      where: { id },
      include: {
        facility: true,
        parent: true,
        children: true,
        servicePoints: true
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
          { description: { contains: query, mode: 'insensitive' } }
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
        facility: true,
        parent: true,
        servicePoints: true
      }
    });
  }

  async getFacilityLocations(facilityId: string): Promise<any[]> {
    return await this.db.location.findMany({
      where: { facilityId, retired: false },
      include: {
        parent: true,
        children: true,
        servicePoints: true
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