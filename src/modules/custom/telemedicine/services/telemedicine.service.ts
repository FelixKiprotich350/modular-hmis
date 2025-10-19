import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

export interface CreateTelemedicineDto {
  patientId: string;
  providerId: string;
  startTime: Date;
  notes?: string;
}

export interface UpdateTelemedicineDto {
  startTime?: Date;
  endTime?: Date;
  status?: string;
  notes?: string;
  sessionUrl?: string;
}

@Injectable()
export class TelemedicineService {
  constructor(private db: PrismaClient) {}

  async createSession(data: CreateTelemedicineDto): Promise<any> {
    return await this.db.telemedicineSession.create({
      data: {
        ...data,
        status: 'scheduled',
        sessionUrl: this.generateSessionUrl()
      }
    });
  }

  async getSession(id: string): Promise<any> {
    return await this.db.telemedicineSession.findUnique({
      where: { id }
    });
  }

  async getPatientSessions(patientId: string): Promise<any[]> {
    return await this.db.telemedicineSession.findMany({
      where: { patientId },
      orderBy: {
        startTime: 'desc'
      }
    });
  }

  async getProviderSessions(providerId: string, date?: Date): Promise<any[]> {
    const where: any = { providerId };
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.startTime = {
        gte: startOfDay,
        lte: endOfDay
      };
    }
    
    return await this.db.telemedicineSession.findMany({
      where,
      orderBy: {
        startTime: 'asc'
      }
    });
  }

  async startSession(sessionId: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const session = await tx.telemedicineSession.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      if (session.status !== 'scheduled') {
        throw new Error('Session cannot be started');
      }

      return await tx.telemedicineSession.update({
        where: { id: sessionId },
        data: {
          status: 'active',
          startTime: new Date()
        }
      });
    });
  }

  async endSession(sessionId: string, notes?: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const session = await tx.telemedicineSession.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      const endTime = new Date();
      const duration = session.startTime ? 
        Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000 / 60) : 0;

      return await tx.telemedicineSession.update({
        where: { id: sessionId },
        data: {
          status: 'completed',
          endTime,
          notes: notes || session.notes
        }
      });
    });
  }

  async getUpcomingSessions(): Promise<any[]> {
    return await this.db.telemedicineSession.findMany({
      where: {
        status: 'scheduled',
        startTime: {
          gte: new Date()
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
  }

  async getActiveSessions(): Promise<any[]> {
    return await this.db.telemedicineSession.findMany({
      where: {
        status: 'active'
      }
    });
  }

  async rescheduleSession(sessionId: string, newStartTime: Date): Promise<any> {
    return await this.db.telemedicineSession.update({
      where: { id: sessionId },
      data: {
        startTime: newStartTime,
        status: 'scheduled'
      }
    });
  }

  async cancelSession(sessionId: string, reason?: string): Promise<any> {
    return await this.db.telemedicineSession.update({
      where: { id: sessionId },
      data: {
        status: 'cancelled',
        notes: reason
      }
    });
  }

  async generateSessionReport(startDate: Date, endDate: Date): Promise<any> {
    const sessions = await this.db.telemedicineSession.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const cancelledSessions = sessions.filter(s => s.status === 'cancelled').length;
    const averageDuration = sessions
      .filter(s => s.startTime && s.endTime)
      .reduce((sum, s) => {
        const duration = (s.endTime!.getTime() - s.startTime.getTime()) / 1000 / 60;
        return sum + duration;
      }, 0) / completedSessions || 0;

    return {
      period: { startDate, endDate },
      summary: {
        totalSessions,
        completedSessions,
        cancelledSessions,
        completionRate: totalSessions > 0 ? (completedSessions / totalSessions * 100).toFixed(2) + '%' : '0%',
        averageDuration: Math.round(averageDuration) + ' minutes'
      },
      sessions
    };
  }

  private generateSessionUrl(): string {
    return `https://telemedicine.health.com/session/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async listSessions(): Promise<any[]> {
    return await this.db.telemedicineSession.findMany({
      orderBy: {
        startTime: 'desc'
      },
      take: 100
    });
  }

  async updateSession(id: string, data: UpdateTelemedicineDto): Promise<any> {
    return await this.db.telemedicineSession.update({
      where: { id },
      data
    });
  }

  async deleteSession(id: string): Promise<boolean> {
    await this.db.telemedicineSession.delete({ where: { id } });
    return true;
  }
}