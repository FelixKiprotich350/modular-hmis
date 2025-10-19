import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreatePharmacyDto } from '../dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from '../dto/update-pharmacy.dto';

export interface DispensationRecord {
  id: string;
  prescriptionId: string;
  dispensedBy: string;
  dispensedAt: Date;
  quantityDispensed: number;
  notes?: string;
}

@Injectable()
export class PharmacyService {
  constructor(private db: PrismaClient) {}

  async createPrescription(data: CreatePharmacyDto): Promise<any> {
    return await this.db.prescription.create({
      data,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        prescriber: true
      }
    });
  }

  async getPrescription(id: string): Promise<any> {
    return await this.db.prescription.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        prescriber: true
      }
    });
  }

  async getPatientPrescriptions(patientId: string, status?: string): Promise<any[]> {
    const where: any = { patientId };
    if (status) {
      where.status = status;
    }
    
    return await this.db.prescription.findMany({
      where,
      include: {
        prescriber: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getPendingPrescriptions(): Promise<any[]> {
    return await this.db.prescription.findMany({
      where: {
        status: 'pending'
      },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        prescriber: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async dispenseMedication(prescriptionId: string, dispensedBy: string, quantityDispensed: number, notes?: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const prescription = await tx.prescription.findUnique({
        where: { id: prescriptionId }
      });

      if (!prescription) {
        throw new Error('Prescription not found');
      }

      if (prescription.status === 'dispensed') {
        throw new Error('Prescription already dispensed');
      }

      if (quantityDispensed > prescription.quantity) {
        throw new Error('Cannot dispense more than prescribed quantity');
      }

      // Check inventory availability
      const inventoryItem = await tx.inventory.findFirst({
        where: {
          itemName: { contains: prescription.medicationName, mode: 'insensitive' }
        }
      });

      if (inventoryItem && inventoryItem.quantity < quantityDispensed) {
        throw new Error('Insufficient inventory');
      }

      // Update prescription status
      const updatedPrescription = await tx.prescription.update({
        where: { id: prescriptionId },
        data: {
          status: quantityDispensed >= prescription.quantity ? 'dispensed' : 'partial',
          dispensedDate: new Date()
        }
      });

      // Update inventory if available
      if (inventoryItem) {
        await tx.inventory.update({
          where: { id: inventoryItem.id },
          data: {
            quantity: inventoryItem.quantity - quantityDispensed
          }
        });
      }

      return {
        prescription: updatedPrescription,
        dispensationRecord: {
          id: 'disp_' + Date.now(),
          prescriptionId,
          dispensedBy,
          dispensedAt: new Date(),
          quantityDispensed,
          notes
        }
      };
    });
  }

  async refillPrescription(prescriptionId: string, refillQuantity: number, dispensedBy: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const prescription = await tx.prescription.findUnique({
        where: { id: prescriptionId }
      });

      if (!prescription) {
        throw new Error('Prescription not found');
      }

      // Create new prescription for refill
      const refillPrescription = await tx.prescription.create({
        data: {
          patientId: prescription.patientId,
          prescriberId: prescription.prescriberId,
          medicationName: prescription.medicationName,
          dosage: prescription.dosage,
          quantity: refillQuantity,
          instructions: prescription.instructions,
          status: 'pending'
        }
      });

      return refillPrescription;
    });
  }

  async searchMedications(query: string): Promise<any[]> {
    // Search in drug table for available medications
    return await this.db.drug.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { genericName: { contains: query, mode: 'insensitive' } }
        ],
        retired: false
      },
      take: 20
    });
  }

  async getDrugInteractions(medicationNames: string[]): Promise<any> {
    // Simplified drug interaction check
    const interactions = [];
    
    for (let i = 0; i < medicationNames.length; i++) {
      for (let j = i + 1; j < medicationNames.length; j++) {
        // This would typically query a drug interaction database
        interactions.push({
          drug1: medicationNames[i],
          drug2: medicationNames[j],
          severity: 'low',
          description: 'Monitor for potential interactions'
        });
      }
    }
    
    return { interactions };
  }

  async generatePharmacyReport(startDate: Date, endDate: Date): Promise<any> {
    const prescriptions = await this.db.prescription.findMany({
      where: {
        createdAt: {
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
        prescriber: true
      }
    });

    const totalPrescriptions = prescriptions.length;
    const dispensedCount = prescriptions.filter(p => p.status === 'dispensed').length;
    const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
    
    const medicationFrequency = prescriptions.reduce((acc, p) => {
      acc[p.medicationName] = (acc[p.medicationName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      period: { startDate, endDate },
      summary: {
        totalPrescriptions,
        dispensedCount,
        pendingCount,
        dispensingRate: (dispensedCount / totalPrescriptions * 100).toFixed(2) + '%'
      },
      topMedications: Object.entries(medicationFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count })),
      prescriptions
    };
  }

  async listPrescriptions(): Promise<any[]> {
    return await this.db.prescription.findMany({
      include: {
        patient: {
          include: {
            person: true
          }
        },
        prescriber: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });
  }

  async updatePrescription(id: string, data: UpdatePharmacyDto): Promise<any> {
    return await this.db.prescription.update({
      where: { id },
      data
    });
  }

  async deletePrescription(id: string): Promise<boolean> {
    await this.db.prescription.delete({ where: { id } });
    return true;
  }
}