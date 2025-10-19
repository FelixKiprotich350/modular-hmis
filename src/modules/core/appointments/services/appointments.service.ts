import { PrismaClient } from '@prisma/client';
import { Appointment } from '../models/appointment.model';

export interface AppointmentType {
  id: string;
  name: string;
  description?: string;
  duration: number;
  retired: boolean;
}

export interface AppointmentBlock {
  id: string;
  providerId: string;
  locationId: string;
  startDate: Date;
  endDate: Date;
  appointmentTypeId: string;
  maxAppointments: number;
  createdAt: Date;
}

export class AppointmentService {
  constructor(private db: PrismaClient) {}

  async createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.appointment.create({
      data,
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
  }

  async getAppointment(id: string): Promise<any> {
    return await this.db.appointment.findUnique({
      where: { id },
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
  }

  async getPatientAppointments(patientId: string): Promise<any[]> {
    return await this.db.appointment.findMany({
      where: { patientId },
      include: {
        provider: true,
        location: true
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    });
  }

  async getProviderAppointments(providerId: string, date?: Date): Promise<any[]> {
    const where: any = { providerId };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.appointmentDate = {
        gte: startOfDay,
        lte: endOfDay
      };
    }
    
    return await this.db.appointment.findMany({
      where,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        location: true
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    });
  }

  async getAppointmentsByDate(date: Date, locationId?: string): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const where: any = {
      appointmentDate: {
        gte: startOfDay,
        lte: endOfDay
      }
    };
    
    if (locationId) {
      where.locationId = locationId;
    }
    
    return await this.db.appointment.findMany({
      where,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        provider: true
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    });
  }

  async getAvailableSlots(providerId: string, date: Date, appointmentTypeId: string): Promise<Date[]> {
    return [];
  }

  async rescheduleAppointment(appointmentId: string, newDate: Date, newTime: string): Promise<any> {
    return await this.db.appointment.update({
      where: { id: appointmentId },
      data: {
        appointmentDate: newDate,
        appointmentTime: newTime
      }
    });
  }

  async cancelAppointment(appointmentId: string, reason?: string): Promise<any> {
    return await this.db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'cancelled',
        reason
      }
    });
  }

  async checkInAppointment(appointmentId: string): Promise<any> {
    return await this.db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'checked-in'
      }
    });
  }

  async getAppointmentTypes(): Promise<AppointmentType[]> {
    return [
      { id: '1', name: 'Consultation', description: 'General consultation', duration: 30, retired: false },
      { id: '2', name: 'Follow-up', description: 'Follow-up visit', duration: 15, retired: false },
      { id: '3', name: 'Procedure', description: 'Medical procedure', duration: 60, retired: false }
    ];
  }

  async createAppointmentBlock(data: Omit<AppointmentBlock, 'id' | 'createdAt'>): Promise<AppointmentBlock> {
    return {
      id: 'block_' + Date.now(),
      ...data,
      createdAt: new Date()
    };
  }

  async getProviderSchedule(providerId: string, startDate: Date, endDate: Date): Promise<AppointmentBlock[]> {
    return [];
  }

  async listAppointments(): Promise<any[]> {
    return await this.db.appointment.findMany({
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
        appointmentDate: 'asc'
      },
      take: 100
    });
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<any> {
    return await this.db.appointment.update({
      where: { id },
      data
    });
  }

  async deleteAppointment(id: string): Promise<boolean> {
    await this.db.appointment.delete({ where: { id } });
    return true;
  }
}