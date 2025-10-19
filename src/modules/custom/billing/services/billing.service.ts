import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateBillingDto } from '../dto/create-billing.dto';
import { UpdateBillingDto } from '../dto/update-billing.dto';

@Injectable()
export class BillingService {
  constructor(private db: PrismaClient) {}

  async createBilling(data: CreateBillingDto): Promise<any> {
    return await this.db.billing.create({
      data,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        insurance: true
      }
    });
  }

  async getBilling(id: string): Promise<any> {
    return await this.db.billing.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        insurance: true
      }
    });
  }

  async getPatientBillings(patientId: string): Promise<any[]> {
    return await this.db.billing.findMany({
      where: { patientId },
      include: {
        insurance: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getBillingsByStatus(status: string): Promise<any[]> {
    return await this.db.billing.findMany({
      where: { status },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        insurance: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async processPayment(billingId: string, paymentAmount: number, paymentMethod: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const billing = await tx.billing.findUnique({
        where: { id: billingId }
      });

      if (!billing) {
        throw new Error('Billing record not found');
      }

      if (billing.status === 'paid') {
        throw new Error('Billing already paid');
      }

      const updatedBilling = await tx.billing.update({
        where: { id: billingId },
        data: {
          status: paymentAmount >= billing.amount ? 'paid' : 'partial',
          paymentDate: new Date()
        }
      });

      return updatedBilling;
    });
  }

  async processInsuranceClaim(billingId: string, insuranceId: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const billing = await tx.billing.findUnique({
        where: { id: billingId }
      });

      if (!billing) {
        throw new Error('Billing record not found');
      }

      const insurance = await tx.insurance.findUnique({
        where: { id: insuranceId }
      });

      if (!insurance) {
        throw new Error('Insurance not found');
      }

      return await tx.billing.update({
        where: { id: billingId },
        data: {
          insuranceId,
          status: 'insurance_pending'
        }
      });
    });
  }

  async generateInvoice(patientId: string, services: { serviceCode: string; amount: number; description?: string }[]): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const totalAmount = services.reduce((sum, service) => sum + service.amount, 0);

      const billings = await Promise.all(
        services.map(service => 
          tx.billing.create({
            data: {
              patientId,
              serviceCode: service.serviceCode,
              amount: service.amount,
              description: service.description,
              status: 'pending'
            }
          })
        )
      );

      return {
        billings,
        totalAmount,
        invoiceNumber: `INV-${Date.now()}`,
        generatedAt: new Date()
      };
    });
  }

  async listBillings(): Promise<any[]> {
    return await this.db.billing.findMany({
      include: {
        patient: {
          include: {
            person: true
          }
        },
        insurance: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });
  }

  async updateBilling(id: string, data: UpdateBillingDto): Promise<any> {
    return await this.db.billing.update({
      where: { id },
      data
    });
  }

  async deleteBilling(id: string): Promise<boolean> {
    await this.db.billing.delete({ where: { id } });
    return true;
  }
}