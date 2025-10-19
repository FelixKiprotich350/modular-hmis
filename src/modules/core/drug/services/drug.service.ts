import { PrismaClient } from '@prisma/client';
import { Drug, DrugOrder } from '../models/drug.model';

export class DrugService {
  constructor(private db: PrismaClient) {}

  async createDrug(data: Omit<Drug, 'id' | 'createdAt' | 'updatedAt'>): Promise<Drug> {
    return {
      id: 'drug_' + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async createDrugOrder(data: Omit<DrugOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<DrugOrder> {
    return {
      id: 'drugorder_' + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getDrugsByName(name: string): Promise<Drug[]> {
    return [];
  }

  async getPatientDrugOrders(patientId: string): Promise<DrugOrder[]> {
    return [];
  }
}