import { PrismaClient } from '@prisma/client';
import { Laboratory, LabTest, LabSpecimen } from '../models/laboratory.model';

export class LaboratoryService {
  constructor(private db: PrismaClient) {}

  async createLabOrder(data: Omit<Laboratory, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.laboratory.create({
      data
    });
  }

  async getLabOrder(id: string): Promise<any> {
    return await this.db.laboratory.findUnique({
      where: { id }
    });
  }

  async getPatientLabOrders(patientId: string, status?: string): Promise<any[]> {
    const where: any = { patientId };
    if (status) {
      where.status = status;
    }
    
    return await this.db.laboratory.findMany({
      where,
      orderBy: {
        orderedAt: 'desc'
      }
    });
  }

  async getLabOrdersByStatus(status: string): Promise<any[]> {
    return await this.db.laboratory.findMany({
      where: { status },
      orderBy: {
        orderedAt: 'desc'
      }
    });
  }

  async collectSpecimen(labOrderId: string, collectedBy: string): Promise<any> {
    return await this.db.laboratory.update({
      where: { id: labOrderId },
      data: {
        status: 'collected'
      }
    });
  }

  async updateLabResult(id: string, result: string, resultValue?: string, abnormal?: boolean): Promise<any> {
    return await this.db.laboratory.update({
      where: { id },
      data: {
        result,
        status: 'completed',
        resultAt: new Date()
      }
    });
  }

  async getLabTests(): Promise<LabTest[]> {
    return [
      { id: '1', name: 'Complete Blood Count', code: 'CBC', category: 'Hematology', specimenType: 'Blood', units: 'cells/μL', retired: false },
      { id: '2', name: 'Blood Glucose', code: 'GLU', category: 'Chemistry', specimenType: 'Blood', units: 'mg/dL', referenceRange: '70-100', retired: false },
      { id: '3', name: 'Urinalysis', code: 'UA', category: 'Urinalysis', specimenType: 'Urine', retired: false },
      { id: '4', name: 'HIV Test', code: 'HIV', category: 'Serology', specimenType: 'Blood', retired: false }
    ];
  }

  async getLabTestsByCategory(category: string): Promise<LabTest[]> {
    return [];
  }

  async createSpecimen(data: Omit<LabSpecimen, 'id' | 'createdAt'>): Promise<LabSpecimen> {
    return {
      id: 'specimen_' + Date.now(),
      ...data,
      createdAt: new Date()
    };
  }

  async getSpecimenByBarcode(barcode: string): Promise<LabSpecimen | null> {
    return null;
  }

  async getPendingResults(): Promise<any[]> {
    return await this.db.laboratory.findMany({
      where: {
        status: { in: ['pending', 'collected'] }
      },
      orderBy: {
        orderedAt: 'asc'
      }
    });
  }

  async getAbnormalResults(patientId?: string): Promise<any[]> {
    const where: any = {
      status: 'completed',
      result: { not: null }
    };
    
    if (patientId) {
      where.patientId = patientId;
    }
    
    return await this.db.laboratory.findMany({
      where,
      orderBy: {
        resultAt: 'desc'
      }
    });
  }

  async listLabOrders(): Promise<any[]> {
    return await this.db.laboratory.findMany({
      orderBy: {
        orderedAt: 'desc'
      },
      take: 100
    });
  }

  async updateLabOrder(id: string, data: Partial<Laboratory>): Promise<any> {
    return await this.db.laboratory.update({
      where: { id },
      data
    });
  }

  async cancelLabOrder(id: string, reason?: string): Promise<any> {
    return await this.db.laboratory.update({
      where: { id },
      data: {
        status: 'cancelled'
      }
    });
  }
}