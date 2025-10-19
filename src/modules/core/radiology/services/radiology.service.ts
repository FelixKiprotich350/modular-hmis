import { PrismaClient } from '@prisma/client';
import { Radiology, RadiologyStudy, RadiologyModality } from '../models/radiology.model';

export class RadiologyService {
  constructor(private db: PrismaClient) {}

  async createRadiologyOrder(data: Omit<Radiology, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.radiology.create({
      data
    });
  }

  async getRadiologyOrder(id: string): Promise<any> {
    return await this.db.radiology.findUnique({
      where: { id }
    });
  }

  async getPatientRadiologyOrders(patientId: string, status?: string): Promise<any[]> {
    const where: any = { patientId };
    if (status) {
      where.status = status;
    }
    
    return await this.db.radiology.findMany({
      where,
      orderBy: {
        orderedAt: 'desc'
      }
    });
  }

  async getOrdersByStatus(status: string): Promise<any[]> {
    return await this.db.radiology.findMany({
      where: { status },
      orderBy: {
        orderedAt: 'desc'
      }
    });
  }

  async scheduleStudy(orderId: string, scheduledAt: Date): Promise<any> {
    return await this.db.radiology.update({
      where: { id: orderId },
      data: {
        status: 'scheduled'
      }
    });
  }

  async startStudy(orderId: string, performedBy: string): Promise<any> {
    return await this.db.radiology.update({
      where: { id: orderId },
      data: {
        status: 'in-progress'
      }
    });
  }

  async updateRadiologyResult(id: string, findings: string, impression: string, radiologist: string): Promise<any> {
    return await this.db.radiology.update({
      where: { id },
      data: {
        result: `${findings}\n\nImpression: ${impression}`,
        status: 'completed',
        resultAt: new Date()
      }
    });
  }

  async getRadiologyStudies(): Promise<RadiologyStudy[]> {
    return [
      { id: '1', name: 'Chest X-Ray', code: 'CXR', modality: 'XR', bodyPart: 'Chest', description: 'Chest radiograph', retired: false },
      { id: '2', name: 'CT Head', code: 'CTH', modality: 'CT', bodyPart: 'Head', description: 'CT scan of head', retired: false },
      { id: '3', name: 'MRI Brain', code: 'MRB', modality: 'MR', bodyPart: 'Brain', description: 'MRI of brain', retired: false },
      { id: '4', name: 'Ultrasound Abdomen', code: 'USA', modality: 'US', bodyPart: 'Abdomen', description: 'Abdominal ultrasound', retired: false }
    ];
  }

  async getStudiesByModality(modality: string): Promise<RadiologyStudy[]> {
    return [];
  }

  async getRadiologyModalities(): Promise<RadiologyModality[]> {
    return [
      { id: '1', name: 'X-Ray', code: 'XR', description: 'Radiography', retired: false },
      { id: '2', name: 'CT Scan', code: 'CT', description: 'Computed Tomography', retired: false },
      { id: '3', name: 'MRI', code: 'MR', description: 'Magnetic Resonance Imaging', retired: false },
      { id: '4', name: 'Ultrasound', code: 'US', description: 'Ultrasonography', retired: false }
    ];
  }

  async getPendingReports(): Promise<any[]> {
    return await this.db.radiology.findMany({
      where: {
        status: { in: ['pending', 'scheduled', 'in-progress'] }
      },
      orderBy: {
        orderedAt: 'asc'
      }
    });
  }

  async getScheduledStudies(date?: Date): Promise<any[]> {
    const where: any = {
      status: 'scheduled'
    };
    
    return await this.db.radiology.findMany({
      where,
      orderBy: {
        orderedAt: 'asc'
      }
    });
  }

  async listRadiologyOrders(): Promise<any[]> {
    return await this.db.radiology.findMany({
      orderBy: {
        orderedAt: 'desc'
      },
      take: 100
    });
  }

  async updateRadiologyOrder(id: string, data: Partial<Radiology>): Promise<any> {
    return await this.db.radiology.update({
      where: { id },
      data
    });
  }

  async cancelRadiologyOrder(id: string, reason?: string): Promise<any> {
    return await this.db.radiology.update({
      where: { id },
      data: {
        status: 'cancelled'
      }
    });
  }
}