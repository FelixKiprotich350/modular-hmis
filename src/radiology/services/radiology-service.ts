import { PrismaClient } from '@prisma/client';

export interface RadiologyOrder {
  id: string;
  patientId: string;
  providerId: string;
  studyType: string;
  urgency: string;
  status: string;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RadiologyReport {
  id: string;
  orderId: string;
  findings: string;
  impression: string;
  radiologistId: string;
  reportDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class RadiologyService {
  constructor(private db: PrismaClient) {}

  async createOrder(data: Omit<RadiologyOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<RadiologyOrder> {
    return {
      id: 'rad_order_' + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async createReport(data: Omit<RadiologyReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<RadiologyReport> {
    return {
      id: 'rad_report_' + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getOrders(): Promise<RadiologyOrder[]> {
    return [];
  }

  async getReports(): Promise<RadiologyReport[]> {
    return [];
  }
}