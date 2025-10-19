import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

export interface CreateMobileClinicDto {
  name: string;
  location: string;
  schedule?: any;
  services: string[];
}

export interface UpdateMobileClinicDto {
  name?: string;
  location?: string;
  schedule?: any;
  services?: string[];
  status?: string;
}

@Injectable()
export class MobileClinicService {
  constructor(private db: PrismaClient) {}

  async createMobileClinic(data: CreateMobileClinicDto): Promise<any> {
    return await this.db.mobileClinic.create({
      data
    });
  }

  async getMobileClinic(id: string): Promise<any> {
    return await this.db.mobileClinic.findUnique({
      where: { id }
    });
  }

  async scheduleClinicVisit(clinicId: string, location: string, date: Date, services: string[]): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const clinic = await tx.mobileClinic.findUnique({
        where: { id: clinicId }
      });

      if (!clinic) {
        throw new Error('Mobile clinic not found');
      }

      const currentSchedule = clinic.schedule as any || {};
      const visitId = `visit_${Date.now()}`;
      
      const updatedSchedule = {
        ...currentSchedule,
        [visitId]: {
          location,
          date: date.toISOString(),
          services,
          status: 'scheduled',
          createdAt: new Date().toISOString()
        }
      };

      return await tx.mobileClinic.update({
        where: { id: clinicId },
        data: {
          schedule: updatedSchedule
        }
      });
    });
  }

  async getClinicSchedule(clinicId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const clinic = await this.db.mobileClinic.findUnique({
      where: { id: clinicId }
    });

    if (!clinic || !clinic.schedule) {
      return { visits: [] };
    }

    const schedule = clinic.schedule as any;
    let visits = Object.entries(schedule).map(([id, visit]: [string, any]) => ({
      id,
      ...visit,
      date: new Date(visit.date)
    }));

    if (startDate && endDate) {
      visits = visits.filter(visit => 
        visit.date >= startDate && visit.date <= endDate
      );
    }

    return {
      clinic: {
        id: clinic.id,
        name: clinic.name,
        location: clinic.location
      },
      visits: visits.sort((a, b) => a.date.getTime() - b.date.getTime())
    };
  }

  async updateVisitStatus(clinicId: string, visitId: string, status: string, notes?: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const clinic = await tx.mobileClinic.findUnique({
        where: { id: clinicId }
      });

      if (!clinic) {
        throw new Error('Mobile clinic not found');
      }

      const schedule = clinic.schedule as any || {};
      if (!schedule[visitId]) {
        throw new Error('Visit not found');
      }

      schedule[visitId] = {
        ...schedule[visitId],
        status,
        notes,
        updatedAt: new Date().toISOString()
      };

      return await tx.mobileClinic.update({
        where: { id: clinicId },
        data: {
          schedule
        }
      });
    });
  }

  async recordPatientVisit(clinicId: string, visitId: string, patientId: string, services: string[], notes?: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      // Create encounter for mobile clinic visit
      const encounter = await tx.encounter.create({
        data: {
          patientId,
          providerId: 'mobile-clinic-provider', // This would be a real provider ID
          encounterType: 'Mobile Clinic Visit',
          startDate: new Date(),
          notes: `Mobile clinic visit - ${notes || ''}`
        }
      });

      // Record services provided as observations
      const observations = await Promise.all(
        services.map(service => 
          tx.observation.create({
            data: {
              patientId,
              encounterId: encounter.id,
              conceptId: 'mobile-clinic-service', // This would be a real concept ID
              value: service,
              obsDate: new Date()
            }
          })
        )
      );

      return {
        encounter,
        observations,
        clinicId,
        visitId
      };
    });
  }

  async generateMobileClinicReport(clinicId: string, startDate: Date, endDate: Date): Promise<any> {
    const clinic = await this.db.mobileClinic.findUnique({
      where: { id: clinicId }
    });

    if (!clinic) {
      throw new Error('Mobile clinic not found');
    }

    const schedule = clinic.schedule as any || {};
    const visits = Object.entries(schedule)
      .map(([id, visit]: [string, any]) => ({ id, ...visit, date: new Date(visit.date) }))
      .filter(visit => visit.date >= startDate && visit.date <= endDate);

    const totalVisits = visits.length;
    const completedVisits = visits.filter(v => v.status === 'completed').length;
    const cancelledVisits = visits.filter(v => v.status === 'cancelled').length;
    
    const servicesProvided = visits
      .filter(v => v.status === 'completed')
      .flatMap(v => v.services || []);
    
    const serviceFrequency = servicesProvided.reduce((acc, service) => {
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      clinic: {
        id: clinic.id,
        name: clinic.name,
        location: clinic.location
      },
      period: { startDate, endDate },
      summary: {
        totalVisits,
        completedVisits,
        cancelledVisits,
        completionRate: totalVisits > 0 ? (completedVisits / totalVisits * 100).toFixed(2) + '%' : '0%',
        totalServicesProvided: servicesProvided.length
      },
      topServices: Object.entries(serviceFrequency)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([service, count]) => ({ service, count })),
      visits
    };
  }

  async listMobileClinics(): Promise<any[]> {
    return await this.db.mobileClinic.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }

  async updateMobileClinic(id: string, data: UpdateMobileClinicDto): Promise<any> {
    return await this.db.mobileClinic.update({
      where: { id },
      data
    });
  }

  async deleteMobileClinic(id: string): Promise<boolean> {
    await this.db.mobileClinic.delete({ where: { id } });
    return true;
  }
}