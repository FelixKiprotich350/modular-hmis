import { PrismaClient } from '@prisma/client';
import { Visit, VisitType, Encounter } from '../models/visit.model';

export class VisitService {
  constructor(private db: PrismaClient) {}

  async createVisit(data: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.visit.create({
      data
    });
  }

  async startVisit(patientId: string, visitType: string, notes?: string): Promise<any> {
    return await this.db.visit.create({
      data: {
        patientId,
        visitType,
        startDate: new Date(),
        notes
      }
    });
  }

  async endVisit(visitId: string, notes?: string): Promise<any> {
    return await this.db.visit.update({
      where: { id: visitId },
      data: {
        endDate: new Date(),
        notes
      }
    });
  }

  async getVisit(id: string): Promise<any> {
    return await this.db.visit.findUnique({
      where: { id },
      include: {
        encounter: true
      }
    });
  }

  async getVisitWithEncounters(id: string): Promise<any> {
    return await this.getVisit(id);
  }

  async getPatientVisits(patientId: string): Promise<any[]> {
    return await this.db.visit.findMany({
      where: { patientId },
      include: {
        encounter: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async getActiveVisits(): Promise<any[]> {
    return await this.db.visit.findMany({
      where: {
        endDate: null
      },
      include: {
        encounter: true
      }
    });
  }

  async getPatientActiveVisit(patientId: string): Promise<any> {
    return await this.db.visit.findFirst({
      where: {
        patientId,
        endDate: null
      },
      include: {
        encounter: true
      }
    });
  }

  async getVisitsByType(visitType: string): Promise<any[]> {
    return await this.db.visit.findMany({
      where: { visitType },
      include: {
        encounter: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async getVisitsByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return await this.db.visit.findMany({
      where: {
        startDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        encounter: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async addEncounterToVisit(visitId: string, encounter: Omit<Encounter, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const createdEncounter = await tx.encounter.create({
        data: encounter,
        include: {
          patient: {
            include: {
              person: true
            }
          },
          provider: true,
          location: true
        }
      });
      
      await tx.visit.update({
        where: { id: visitId },
        data: {
          encounterId: createdEncounter.id
        }
      });
      
      return createdEncounter;
    });
  }

  async getVisitTypes(): Promise<VisitType[]> {
    return [
      { id: '1', name: 'Outpatient', description: 'Outpatient visit', retired: false },
      { id: '2', name: 'Inpatient', description: 'Inpatient admission', retired: false },
      { id: '3', name: 'Emergency', description: 'Emergency visit', retired: false },
      { id: '4', name: 'Follow-up', description: 'Follow-up visit', retired: false }
    ];
  }

  async listVisits(): Promise<any[]> {
    return await this.db.visit.findMany({
      include: {
        encounter: true
      },
      orderBy: {
        startDate: 'desc'
      },
      take: 100
    });
  }

  async updateVisit(id: string, data: Partial<Visit>): Promise<any> {
    return await this.db.visit.update({
      where: { id },
      data
    });
  }

  async deleteVisit(id: string): Promise<boolean> {
    await this.db.visit.delete({ where: { id } });
    return true;
  }
}