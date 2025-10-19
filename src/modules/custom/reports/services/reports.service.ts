import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

export interface CreateReportDto {
  title: string;
  type: string;
  parameters?: any;
  generatedBy: string;
}

@Injectable()
export class ReportsService {
  constructor(private db: PrismaClient) {}

  async generatePatientStatistics(): Promise<any> {
    const totalPatients = await this.db.patient.count();
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const newPatientsThisMonth = await this.db.patient.count({
      where: {
        createdAt: {
          gte: thisMonth
        }
      }
    });

    const patients = await this.db.patient.findMany({
      include: {
        person: true
      }
    });

    const genderDistribution = patients.reduce((acc, p) => {
      acc[p.person.gender] = (acc[p.person.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageAge = patients
      .filter(p => p.person.birthdate)
      .reduce((sum, p) => {
        const age = new Date().getFullYear() - new Date(p.person.birthdate!).getFullYear();
        return sum + age;
      }, 0) / patients.length || 0;

    return {
      totalPatients,
      newPatientsThisMonth,
      averageAge: Math.round(averageAge),
      genderDistribution
    };
  }

  async generateFinancialReport(startDate: Date, endDate: Date): Promise<any> {
    const billings = await this.db.billing.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const totalRevenue = billings
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);

    const pendingRevenue = billings
      .filter(b => b.status === 'pending')
      .reduce((sum, b) => sum + b.amount, 0);

    return {
      period: { startDate, endDate },
      totalRevenue,
      pendingRevenue,
      totalBillings: billings.length,
      paidBillings: billings.filter(b => b.status === 'paid').length,
      billings
    };
  }

  async generateClinicalReport(type: string, startDate?: Date, endDate?: Date): Promise<any> {
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = { gte: startDate, lte: endDate };
    }

    switch (type) {
      case 'encounters':
        const encounters = await this.db.encounter.findMany({
          where,
          include: {
            patient: { include: { person: true } },
            provider: true,
            observations: { include: { concept: true } }
          }
        });
        return { reportType: type, data: encounters, count: encounters.length };

      case 'observations':
        const observations = await this.db.observation.findMany({
          where,
          include: {
            patient: { include: { person: true } },
            concept: true,
            encounter: true
          }
        });
        return { reportType: type, data: observations, count: observations.length };

      case 'prescriptions':
        const prescriptions = await this.db.prescription.findMany({
          where,
          include: {
            patient: { include: { person: true } },
            prescriber: true
          }
        });
        return { reportType: type, data: prescriptions, count: prescriptions.length };

      default:
        return { reportType: type, data: [], count: 0 };
    }
  }

  async createReport(data: CreateReportDto): Promise<any> {
    return await this.db.report.create({
      data: {
        ...data,
        status: 'pending'
      }
    });
  }

  async generateReport(reportId: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const report = await tx.report.findUnique({
        where: { id: reportId }
      });

      if (!report) {
        throw new Error('Report not found');
      }

      let reportData;
      switch (report.type) {
        case 'patient_statistics':
          reportData = await this.generatePatientStatistics();
          break;
        case 'financial':
          const params = report.parameters as any;
          reportData = await this.generateFinancialReport(
            new Date(params.startDate),
            new Date(params.endDate)
          );
          break;
        case 'clinical':
          const clinicalParams = report.parameters as any;
          reportData = await this.generateClinicalReport(
            clinicalParams.clinicalType,
            clinicalParams.startDate ? new Date(clinicalParams.startDate) : undefined,
            clinicalParams.endDate ? new Date(clinicalParams.endDate) : undefined
          );
          break;
        default:
          reportData = { error: 'Unknown report type' };
      }

      return await tx.report.update({
        where: { id: reportId },
        data: {
          status: 'completed',
          filePath: `reports/${reportId}.json`
        }
      });
    });
  }

  async getDashboardData(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await this.db.appointment.count({
      where: {
        appointmentDate: {
          gte: today,
          lt: tomorrow
        },
        status: 'scheduled'
      }
    });

    const recentPatients = await this.db.patient.findMany({
      include: {
        person: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    const pendingPrescriptions = await this.db.prescription.count({
      where: {
        status: 'pending'
      }
    });

    const lowStockItems = await this.db.inventory.count({
      where: {
        quantity: {
          lte: 10
        }
      }
    });

    return {
      todayAppointments,
      pendingPrescriptions,
      recentPatients,
      alerts: [
        ...(lowStockItems > 0 ? [{ type: 'warning', message: `${lowStockItems} items low in stock` }] : []),
        ...(pendingPrescriptions > 0 ? [{ type: 'info', message: `${pendingPrescriptions} prescriptions pending` }] : [])
      ]
    };
  }

  async listReports(): Promise<any[]> {
    return await this.db.report.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });
  }

  async getReport(id: string): Promise<any> {
    return await this.db.report.findUnique({
      where: { id }
    });
  }

  async deleteReport(id: string): Promise<boolean> {
    await this.db.report.delete({ where: { id } });
    return true;
  }
}