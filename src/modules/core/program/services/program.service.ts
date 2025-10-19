import { PrismaClient } from '@prisma/client';
import { Program, ProgramEnrollment, ProgramWorkflow } from '../models/program.model';

export class ProgramService {
  constructor(private db: PrismaClient) {}

  async createProgram(data: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> {
    return {
      id: 'program_' + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async enrollPatient(data: Omit<ProgramEnrollment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProgramEnrollment> {
    return {
      id: 'enrollment_' + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getPatientEnrollments(patientId: string): Promise<ProgramEnrollment[]> {
    return [];
  }

  async completeEnrollment(enrollmentId: string, outcome?: string): Promise<ProgramEnrollment | null> {
    return null;
  }
}