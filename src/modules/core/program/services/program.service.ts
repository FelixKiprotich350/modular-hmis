import { PrismaClient } from '@prisma/client';
import { Program, ProgramEnrollment, ProgramWorkflow, ProgramWorkflowState } from '../models/program.model';

export interface PatientProgramState {
  id: string;
  enrollmentId: string;
  stateId: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}

export class ProgramService {
  constructor(private db: PrismaClient) {}

  async createProgram(data: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.program.create({
      data
    });
  }

  async getProgram(id: string): Promise<any> {
    return await this.db.program.findUnique({
      where: { id },
      include: {
        enrollments: true,
        workflows: true
      }
    });
  }

  async enrollPatient(data: Omit<ProgramEnrollment, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return await this.db.programEnrollment.create({
      data,
      include: {
        patient: {
          include: {
            person: true
          }
        },
        program: true,
        location: true
      }
    });
  }

  async getPatientEnrollments(patientId: string): Promise<any[]> {
    return await this.db.programEnrollment.findMany({
      where: { patientId },
      include: {
        program: true,
        location: true
      },
      orderBy: {
        dateEnrolled: 'desc'
      }
    });
  }

  async getProgramEnrollments(programId: string): Promise<any[]> {
    return await this.db.programEnrollment.findMany({
      where: { programId },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        location: true
      },
      orderBy: {
        dateEnrolled: 'desc'
      }
    });
  }

  async getActiveEnrollments(): Promise<any[]> {
    return await this.db.programEnrollment.findMany({
      where: {
        dateCompleted: null,
        voided: false
      },
      include: {
        patient: {
          include: {
            person: true
          }
        },
        program: true,
        location: true
      }
    });
  }

  async completeEnrollment(enrollmentId: string, outcome?: string, completionDate?: Date): Promise<any> {
    return await this.db.programEnrollment.update({
      where: { id: enrollmentId },
      data: {
        dateCompleted: completionDate || new Date(),
        outcome
      }
    });
  }

  async changeEnrollmentState(enrollmentId: string, stateId: string, startDate?: Date): Promise<PatientProgramState> {
    return {
      id: 'state_' + Date.now(),
      enrollmentId,
      stateId,
      startDate: startDate || new Date(),
      createdAt: new Date()
    };
  }

  async getEnrollmentStates(enrollmentId: string): Promise<PatientProgramState[]> {
    return [];
  }

  async getProgramWorkflows(): Promise<any[]> {
    return await this.db.programWorkflow.findMany({
      where: { retired: false },
      include: {
        program: true,
        states: true
      }
    });
  }

  async getWorkflowStates(workflowId: string): Promise<any[]> {
    return await this.db.programWorkflowState.findMany({
      where: {
        programWorkflowId: workflowId,
        retired: false
      }
    });
  }

  async listPrograms(): Promise<any[]> {
    return await this.db.program.findMany({
      where: { retired: false },
      include: {
        workflows: true
      }
    });
  }

  async updateProgram(id: string, data: Partial<Program>): Promise<any> {
    return await this.db.program.update({
      where: { id },
      data
    });
  }

  async deleteProgram(id: string): Promise<boolean> {
    await this.db.program.delete({ where: { id } });
    return true;
  }
}