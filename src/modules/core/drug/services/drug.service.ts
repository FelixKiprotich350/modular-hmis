import { PrismaClient } from '@prisma/client';
import { Drug, DrugOrder } from '../models/drug.model';

export interface DrugFormulation {
  id: string;
  name: string;
  description?: string;
  retired: boolean;
}

export interface DrugStrength {
  id: string;
  drugId: string;
  strength: string;
  units: string;
  retired: boolean;
}

export class DrugService {
  constructor(private db: PrismaClient) {}

  async createDrug(data: Omit<Drug, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.drug.create({
      data
    });
  }

  async getDrug(id: string): Promise<any> {
    return await this.db.drug.findUnique({
      where: { id }
    });
  }

  async getDrugsByName(name: string): Promise<any[]> {
    return await this.db.drug.findMany({
      where: {
        OR: [
          { name: { contains: name, mode: 'insensitive' } },
          { genericName: { contains: name, mode: 'insensitive' } }
        ],
        retired: false
      }
    });
  }

  async searchDrugs(query: string): Promise<any[]> {
    return await this.db.drug.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { genericName: { contains: query, mode: 'insensitive' } }
        ],
        retired: false
      }
    });
  }

  async createDrugOrder(data: Omit<DrugOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.drugOrder.create({
      data,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        drug: true
      }
    });
  }

  async getDrugOrder(id: string): Promise<any> {
    return await this.db.drugOrder.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        drug: true
      }
    });
  }

  async getPatientDrugOrders(patientId: string, status?: string): Promise<any[]> {
    const where: any = { patientId };
    if (status) {
      where.status = status;
    }
    
    return await this.db.drugOrder.findMany({
      where,
      include: {
        drug: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async getActiveDrugOrders(patientId?: string): Promise<any[]> {
    const where: any = {
      status: 'ACTIVE',
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } }
      ]
    };
    
    if (patientId) {
      where.patientId = patientId;
    }
    
    return await this.db.drugOrder.findMany({
      where,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        drug: true
      }
    });
  }

  async discontinueDrugOrder(drugOrderId: string, reason: string, discontinuedBy: string): Promise<any> {
    return await this.db.drugOrder.update({
      where: { id: drugOrderId },
      data: {
        status: 'DISCONTINUED'
      }
    });
  }

  async dispenseDrugOrder(drugOrderId: string, quantityDispensed: number, dispensedBy: string): Promise<any> {
    return await this.db.drugOrder.update({
      where: { id: drugOrderId },
      data: {
        status: 'DISPENSED'
      }
    });
  }

  async getDrugFormulations(): Promise<DrugFormulation[]> {
    return [
      { id: '1', name: 'Tablet', description: 'Oral tablet', retired: false },
      { id: '2', name: 'Capsule', description: 'Oral capsule', retired: false },
      { id: '3', name: 'Syrup', description: 'Liquid syrup', retired: false },
      { id: '4', name: 'Injection', description: 'Injectable solution', retired: false }
    ];
  }

  async getDrugInteractions(drugId: string): Promise<Drug[]> {
    return [];
  }

  async checkDrugAllergies(patientId: string, drugId: string): Promise<boolean> {
    return false;
  }

  async getPatientMedications(patientId: string): Promise<any[]> {
    return await this.db.drugOrder.findMany({
      where: { patientId },
      include: {
        drug: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async listDrugs(): Promise<any[]> {
    return await this.db.drug.findMany({
      where: { retired: false }
    });
  }

  async updateDrug(id: string, data: Partial<Drug>): Promise<any> {
    return await this.db.drug.update({
      where: { id },
      data
    });
  }

  async updateDrugOrder(id: string, data: Partial<DrugOrder>): Promise<any> {
    return await this.db.drugOrder.update({
      where: { id },
      data
    });
  }

  async deleteDrug(id: string): Promise<boolean> {
    await this.db.drug.delete({ where: { id } });
    return true;
  }
}