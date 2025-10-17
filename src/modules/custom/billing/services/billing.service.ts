import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ServiceRegistry } from '../../../../core/service-registry';

@Injectable()
export class BillingService {
  constructor(
    private db: PrismaClient,
    private serviceRegistry: ServiceRegistry
  ) {}

  async processPharmacyOrder(patientId: string, prescriptionId: string, amount: number) {
    return await this.db.$transaction(async (tx) => {
      const invoice = {
        id: 'invoice_' + Date.now(),
        patientId,
        amount,
        status: 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const pharmacyService = this.serviceRegistry.get('pharmacyService') as any;
      if (!pharmacyService) throw new Error('Pharmacy service not available');
      
      const dispensed = await pharmacyService.dispenseMedication(prescriptionId);
      if (!dispensed) throw new Error('Failed to dispense medication');

      return { invoice, dispensed: true };
    });
  }
}