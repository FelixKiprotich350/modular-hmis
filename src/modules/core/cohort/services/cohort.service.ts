import { PrismaClient } from '@prisma/client';
import { Cohort, CohortMember, CohortDefinition, CohortType } from '../models/cohort.model';

export class CohortService {
  constructor(private db: PrismaClient) {}

  async createCohort(data: Omit<Cohort, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.cohort.create({
      data
    });
  }

  async getCohort(id: string): Promise<any> {
    return await this.db.cohort.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            patient: {
              include: {
                person: true
              }
            }
          }
        }
      }
    });
  }

  async searchCohorts(query: string): Promise<any[]> {
    return await this.db.cohort.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      }
    });
  }

  async addPatientToCohort(cohortId: string, patientId: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const existing = await tx.cohortMember.findUnique({
        where: {
          cohortId_patientId: {
            cohortId,
            patientId
          }
        }
      });
      
      if (existing) {
        throw new Error('Patient already in cohort');
      }
      
      return await tx.cohortMember.create({
        data: {
          cohortId,
          patientId,
          startDate: new Date()
        },
        include: {
          patient: {
            include: {
              person: true
            }
          },
          cohort: true
        }
      });
    });
  }

  async removePatientFromCohort(cohortId: string, patientId: string): Promise<boolean> {
    await this.db.cohortMember.update({
      where: {
        cohortId_patientId: {
          cohortId,
          patientId
        }
      },
      data: {
        endDate: new Date()
      }
    });
    return true;
  }

  async getCohortMembers(cohortId: string): Promise<any[]> {
    return await this.db.cohortMember.findMany({
      where: {
        cohortId,
        endDate: null
      },
      include: {
        patient: {
          include: {
            person: true
          }
        }
      }
    });
  }

  async getPatientCohorts(patientId: string): Promise<any[]> {
    return await this.db.cohort.findMany({
      where: {
        members: {
          some: {
            patientId,
            endDate: null
          }
        }
      }
    });
  }

  async createCohortDefinition(data: Omit<CohortDefinition, 'id' | 'createdAt'>): Promise<CohortDefinition> {
    return {
      id: 'def_' + Date.now(),
      ...data,
      createdAt: new Date()
    };
  }

  async evaluateCohortDefinition(definitionId: string): Promise<string[]> {
    return [];
  }

  async getCohortDefinitions(): Promise<CohortDefinition[]> {
    return [];
  }

  async getCohortTypes(): Promise<CohortType[]> {
    return [
      { id: '1', name: 'Static', description: 'Manually managed cohort', retired: false },
      { id: '2', name: 'Dynamic', description: 'Query-based cohort', retired: false },
      { id: '3', name: 'Program', description: 'Program-based cohort', retired: false }
    ];
  }

  async getCohortsByType(typeId: string): Promise<Cohort[]> {
    return [];
  }

  async getCohortStatistics(cohortId: string): Promise<any> {
    return {
      totalMembers: 0,
      activeMembers: 0,
      averageAge: 0,
      genderDistribution: { male: 0, female: 0 }
    };
  }

  async exportCohort(cohortId: string, format: 'CSV' | 'JSON'): Promise<any> {
    return { cohortId, format, exportedAt: new Date() };
  }

  async listCohorts(): Promise<any[]> {
    return await this.db.cohort.findMany({
      include: {
        members: {
          where: {
            endDate: null
          }
        }
      }
    });
  }

  async updateCohort(id: string, data: Partial<Cohort>): Promise<any> {
    return await this.db.cohort.update({
      where: { id },
      data
    });
  }

  async deleteCohort(id: string): Promise<boolean> {
    await this.db.$transaction(async (tx) => {
      await tx.cohortMember.deleteMany({
        where: { cohortId: id }
      });
      await tx.cohort.delete({
        where: { id }
      });
    });
    return true;
  }
}