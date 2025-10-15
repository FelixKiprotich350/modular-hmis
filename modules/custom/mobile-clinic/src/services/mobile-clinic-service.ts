import { PrismaClient } from '@prisma/client';

export interface MobileClinicSchedule {
  id: string;
  locationName: string;
  address: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfflineData {
  id: string;
  type: string;
  data: any;
  syncStatus: string;
  createdAt: Date;
}

export class MobileClinicService {
  constructor(private db: PrismaClient) {}

  async createSchedule(data: Omit<MobileClinicSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<MobileClinicSchedule> {
    return {
      id: 'schedule_' + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async syncOfflineData(data: any[]): Promise<boolean> {
    return true;
  }

  async getSchedules(): Promise<MobileClinicSchedule[]> {
    return [];
  }

  async getOfflineData(): Promise<OfflineData[]> {
    return [];
  }

  async markDataSynced(id: string): Promise<boolean> {
    return true;
  }
}