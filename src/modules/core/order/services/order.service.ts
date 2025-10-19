import { PrismaClient } from '@prisma/client';
import { Order, OrderType } from '../models/order.model';

export class OrderService {
  constructor(private db: PrismaClient) {}

  async createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.order.create({
      data,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true,
        encounter: true
      }
    });
  }

  async getOrder(id: string): Promise<any> {
    return await this.db.order.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true,
        encounter: true
      }
    });
  }

  async getPatientOrders(patientId: string, status?: string): Promise<any[]> {
    const where: any = { patientId };
    if (status) {
      where.status = status;
    }
    
    return await this.db.order.findMany({
      where,
      include: {
        concept: true,
        encounter: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async getOrdersByProvider(providerId: string): Promise<any[]> {
    return await this.db.order.findMany({
      where: { orderer: providerId },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true
      }
    });
  }

  async getOrdersByType(orderTypeId: string): Promise<any[]> {
    return await this.db.order.findMany({
      where: { orderTypeId },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true
      }
    });
  }

  async getOrdersByStatus(status: string): Promise<any[]> {
    return await this.db.order.findMany({
      where: { status },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true
      }
    });
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return await this.db.order.findMany({
      where: {
        startDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true
      }
    });
  }

  async activateOrder(orderId: string): Promise<any> {
    return await this.db.order.update({
      where: { id: orderId },
      data: { status: 'ACTIVE' }
    });
  }

  async discontinueOrder(orderId: string, reason: string, discontinuedBy: string): Promise<any> {
    return await this.db.order.update({
      where: { id: orderId },
      data: {
        discontinued: true,
        discontinuedDate: new Date(),
        discontinuedReason: reason,
        status: 'DISCONTINUED'
      }
    });
  }

  async renewOrder(orderId: string, newAutoExpireDate?: Date): Promise<any> {
    return await this.db.order.update({
      where: { id: orderId },
      data: {
        autoExpireDate: newAutoExpireDate,
        status: 'RENEWED'
      }
    });
  }

  async getOrderTypes(): Promise<OrderType[]> {
    return [
      { id: '1', name: 'Drug Order', description: 'Medication orders', javaClassName: 'DrugOrder', retired: false },
      { id: '2', name: 'Test Order', description: 'Laboratory test orders', javaClassName: 'TestOrder', retired: false },
      { id: '3', name: 'Radiology Order', description: 'Imaging study orders', javaClassName: 'RadiologyOrder', retired: false },
      { id: '4', name: 'Procedure Order', description: 'Medical procedure orders', javaClassName: 'ProcedureOrder', retired: false }
    ];
  }

  async getActiveOrders(patientId?: string): Promise<any[]> {
    const where: any = {
      status: 'ACTIVE',
      discontinued: false,
      OR: [
        { autoExpireDate: null },
        { autoExpireDate: { gte: new Date() } }
      ]
    };
    
    if (patientId) {
      where.patientId = patientId;
    }
    
    return await this.db.order.findMany({
      where,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true
      }
    });
  }

  async getExpiredOrders(): Promise<any[]> {
    return await this.db.order.findMany({
      where: {
        autoExpireDate: {
          lt: new Date()
        },
        status: { not: 'EXPIRED' }
      },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true
      }
    });
  }

  async listOrders(): Promise<any[]> {
    return await this.db.order.findMany({
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true
      },
      orderBy: {
        startDate: 'desc'
      },
      take: 100
    });
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<any> {
    return await this.db.order.update({
      where: { id },
      data
    });
  }

  async deleteOrder(id: string): Promise<boolean> {
    await this.db.order.delete({ where: { id } });
    return true;
  }
}