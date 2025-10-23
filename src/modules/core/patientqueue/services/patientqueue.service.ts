import { PrismaClient } from '@prisma/client';
import { PatientQueue } from '../models/patientqueue.model';

export class PatientQueueService {
  constructor(private db: PrismaClient) {}

  async addToQueue(data: {
    patientId: string;
    providerId?: string;
    servicePointId?: string;
    queueType: string;
    priority?: number;
    notes?: string;
    estimatedWaitTime?: number;
  }): Promise<PatientQueue> {
    return await this.db.patientQueue.create({
      data: {
        ...data,
        priority: data.priority || 1,
        status: 'waiting'
      },
      include: {
        patient: {
          include: {
            person: true,
            identifiers: true
          }
        },
        provider: true,
        servicePoint: {
          include: {
            location: true
          }
        }
      }
    });
  }

  async getQueueByType(queueType: string, servicePointId?: string): Promise<PatientQueue[]> {
    return await this.db.patientQueue.findMany({
      where: {
        queueType,
        servicePointId,
        status: { in: ['waiting', 'in_progress'] }
      },
      include: {
        patient: {
          include: {
            person: true,
            identifiers: true
          }
        },
        provider: true,
        servicePoint: {
          include: {
            location: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { queuedAt: 'asc' }
      ]
    });
  }

  async getProviderQueue(providerId: string): Promise<PatientQueue[]> {
    return await this.db.patientQueue.findMany({
      where: {
        providerId,
        status: { in: ['waiting', 'in_progress'] }
      },
      include: {
        patient: {
          include: {
            person: true,
            identifiers: true
          }
        },
        servicePoint: {
          include: {
            location: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { queuedAt: 'asc' }
      ]
    });
  }

  async startService(queueEntryId: string): Promise<PatientQueue> {
    const startTime = new Date();
    const entry = await this.db.patientQueue.findUnique({
      where: { id: queueEntryId }
    });

    if (entry) {
      const waitTime = Math.floor((startTime.getTime() - entry.queuedAt.getTime()) / (1000 * 60));
      
      return await this.db.patientQueue.update({
        where: { id: queueEntryId },
        data: {
          status: 'in_progress',
          startedAt: startTime,
          actualWaitTime: waitTime
        },
        include: {
          patient: {
            include: {
              person: true,
              identifiers: true
            }
          },
          provider: true,
          servicePoint: {
            include: {
              location: true
            }
          }
        }
      });
    }
    throw new Error('Queue entry not found');
  }

  async completeService(queueEntryId: string): Promise<PatientQueue> {
    return await this.db.patientQueue.update({
      where: { id: queueEntryId },
      data: {
        status: 'completed',
        completedAt: new Date()
      },
      include: {
        patient: {
          include: {
            person: true,
            identifiers: true
          }
        },
        provider: true,
        servicePoint: {
          include: {
            location: true
          }
        }
      }
    });
  }

  async cancelQueueEntry(queueEntryId: string): Promise<PatientQueue> {
    return await this.db.patientQueue.update({
      where: { id: queueEntryId },
      data: {
        status: 'cancelled',
        completedAt: new Date()
      }
    });
  }

  async updateQueueEntry(queueEntryId: string, data: Partial<PatientQueue>): Promise<PatientQueue> {
    return await this.db.patientQueue.update({
      where: { id: queueEntryId },
      data,
      include: {
        patient: {
          include: {
            person: true,
            identifiers: true
          }
        },
        provider: true,
        servicePoint: {
          include: {
            location: true
          }
        }
      }
    });
  }

  async getPatientQueueHistory(patientId: string): Promise<PatientQueue[]> {
    return await this.db.patientQueue.findMany({
      where: { patientId },
      include: {
        provider: true,
        servicePoint: {
          include: {
            location: true
          }
        }
      },
      orderBy: { queuedAt: 'desc' }
    });
  }

  async getQueueStats(queueType?: string, servicePointId?: string): Promise<any> {
    const where: any = {};
    if (queueType) where.queueType = queueType;
    if (servicePointId) where.servicePointId = servicePointId;

    const [waiting, inProgress, avgWaitTime] = await Promise.all([
      this.db.patientQueue.count({
        where: { ...where, status: 'waiting' }
      }),
      this.db.patientQueue.count({
        where: { ...where, status: 'in_progress' }
      }),
      this.db.patientQueue.aggregate({
        where: { ...where, actualWaitTime: { not: null } },
        _avg: { actualWaitTime: true }
      })
    ]);

    return {
      waiting,
      inProgress,
      total: waiting + inProgress,
      avgWaitTime: Math.round(avgWaitTime._avg.actualWaitTime || 0)
    };
  }
}