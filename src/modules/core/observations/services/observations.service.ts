import { PrismaClient } from '@prisma/client';
import { Observation, ObservationGroup } from '../models/observation.model';

export class ObservationService {
  constructor(private db: PrismaClient) {}

  async createObservation(data: Omit<Observation, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.observation.create({
      data,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        encounter: true,
        concept: true
      }
    });
  }

  async createObservationGroup(patientId: string, encounterId: string, conceptId: string, observations: Omit<Observation, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const createdObs = await Promise.all(
        observations.map(obs => 
          tx.observation.create({
            data: {
              ...obs,
              patientId,
              encounterId
            },
            include: {
              concept: true
            }
          })
        )
      );
      
      return {
        id: 'obsgroup_' + Date.now(),
        patientId,
        encounterId,
        conceptId,
        observations: createdObs,
        obsDate: new Date(),
        createdAt: new Date()
      };
    });
  }

  async getObservation(id: string): Promise<any> {
    return await this.db.observation.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        encounter: true,
        concept: true
      }
    });
  }

  async getPatientObservations(patientId: string, conceptId?: string): Promise<any[]> {
    const where: any = { patientId };
    if (conceptId) {
      where.conceptId = conceptId;
    }
    
    return await this.db.observation.findMany({
      where,
      include: {
        concept: true,
        encounter: true
      },
      orderBy: {
        obsDate: 'desc'
      }
    });
  }

  async getEncounterObservations(encounterId: string): Promise<any[]> {
    return await this.db.observation.findMany({
      where: { encounterId },
      include: {
        concept: true,
        patient: {
          include: {
            person: true
          }
        }
      }
    });
  }

  async getObservationsByConcept(conceptId: string): Promise<any[]> {
    return await this.db.observation.findMany({
      where: { conceptId },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        encounter: true,
        concept: true
      },
      take: 100
    });
  }

  async getObservationsByDateRange(patientId: string, startDate: Date, endDate: Date): Promise<any[]> {
    return await this.db.observation.findMany({
      where: {
        patientId,
        obsDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        concept: true,
        encounter: true
      },
      orderBy: {
        obsDate: 'desc'
      }
    });
  }

  async getLatestObservation(patientId: string, conceptId: string): Promise<any> {
    return await this.db.observation.findFirst({
      where: {
        patientId,
        conceptId
      },
      include: {
        concept: true,
        encounter: true
      },
      orderBy: {
        obsDate: 'desc'
      }
    });
  }

  async getVitalSigns(patientId: string, encounterId?: string): Promise<any[]> {
    const vitalConcepts = ['Temperature', 'Blood Pressure Systolic', 'Blood Pressure Diastolic', 'Weight', 'Height'];
    
    const where: any = {
      patientId,
      concept: {
        name: {
          in: vitalConcepts
        }
      }
    };
    
    if (encounterId) {
      where.encounterId = encounterId;
    }
    
    return await this.db.observation.findMany({
      where,
      include: {
        concept: true,
        encounter: true
      },
      orderBy: {
        obsDate: 'desc'
      }
    });
  }

  async recordVitalSigns(patientId: string, encounterId: string, vitals: { conceptId: string; value: string; units?: string }[]): Promise<any[]> {
    return await this.db.$transaction(async (tx) => {
      return await Promise.all(
        vitals.map(vital => 
          tx.observation.create({
            data: {
              patientId,
              encounterId,
              conceptId: vital.conceptId,
              value: vital.value,
              units: vital.units,
              obsDate: new Date()
            },
            include: {
              concept: true
            }
          })
        )
      );
    });
  }

  async listObservations(): Promise<any[]> {
    return await this.db.observation.findMany({
      include: {
        patient: {
          include: {
            person: true
          }
        },
        concept: true,
        encounter: true
      },
      orderBy: {
        obsDate: 'desc'
      },
      take: 100
    });
  }

  async updateObservation(id: string, data: Partial<Observation>): Promise<any> {
    return await this.db.observation.update({
      where: { id },
      data
    });
  }

  async deleteObservation(id: string): Promise<boolean> {
    await this.db.observation.delete({ where: { id } });
    return true;
  }

  async voidObservation(id: string, reason: string): Promise<any> {
    return await this.db.observation.update({
      where: { id },
      data: {
        notes: `VOIDED: ${reason}`
      }
    });
  }
}