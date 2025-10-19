import { PrismaClient } from '@prisma/client';
import { Encounter, EncounterType, Observation } from '../models/encounter.model';

export class EncounterService {
  constructor(private db: PrismaClient) {}

  async createEncounter(data: Omit<Encounter, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.encounter.create({
      data: data as any,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        provider: {
          include: {
            person: true
          }
        },
        location: true
      }
    });
  }

  async getEncounter(id: string): Promise<any> {
    return await this.db.encounter.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        provider: true,
        location: true,
        observations: {
          include: {
            concept: true
          }
        }
      }
    });
  }

  async getEncounterWithObservations(id: string): Promise<any> {
    return await this.getEncounter(id);
  }

  async getPatientEncounters(patientId: string): Promise<any[]> {
    return await this.db.encounter.findMany({
      where: { patientId },
      include: {
        provider: true,
        location: true,
        observations: {
          include: {
            concept: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async getEncountersByType(encounterType: string): Promise<any[]> {
    return await this.db.encounter.findMany({
      where: { encounterType },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        provider: true,
        location: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async getEncountersByProvider(providerId: string): Promise<any[]> {
    return await this.db.encounter.findMany({
      where: { providerId },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        location: true,
        observations: {
          include: {
            concept: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async getEncountersByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return await this.db.encounter.findMany({
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
        provider: true,
        location: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async closeEncounter(encounterId: string): Promise<any> {
    return await this.db.encounter.update({
      where: { id: encounterId },
      data: {
        endDate: new Date()
      }
    });
  }

  async addObservationToEncounter(encounterId: string, observation: Omit<Observation, 'id' | 'encounterId' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.observation.create({
      data: {
        ...observation,
        encounterId
      },
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

  async getEncounterTypes(): Promise<EncounterType[]> {
    return [
      { id: '1', name: 'Initial', description: 'Initial patient visit', retired: false },
      { id: '2', name: 'Return', description: 'Return visit', retired: false },
      { id: '3', name: 'Emergency', description: 'Emergency visit', retired: false },
      { id: '4', name: 'Consultation', description: 'Specialist consultation', retired: false }
    ];
  }

  async listEncounters(): Promise<any[]> {
    return await this.db.encounter.findMany({
      include: {
        patient: {
          include: {
            person: true
          }
        },
        provider: true,
        location: true
      },
      orderBy: {
        startDate: 'desc'
      },
      take: 100
    });
  }

  async updateEncounter(id: string, data: Partial<Encounter>): Promise<any> {
    return await this.db.encounter.update({
      where: { id },
      data: data as any
    });
  }

  async deleteEncounter(id: string): Promise<boolean> {
    await this.db.encounter.delete({ where: { id } });
    return true;
  }
}