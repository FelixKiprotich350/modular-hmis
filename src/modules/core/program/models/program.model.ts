export interface Program {
  id: string;
  name: string;
  description?: string;
  concept?: string;
  retired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramWorkflow {
  id: string;
  programId: string;
  concept: string;
  retired: boolean;
  createdAt: Date;
}

export interface ProgramWorkflowState {
  id: string;
  programWorkflowId: string;
  concept: string;
  initial: boolean;
  terminal: boolean;
  retired: boolean;
}

export interface ProgramEnrollment {
  id: string;
  patientId: string;
  programId: string;
  dateEnrolled: Date;
  dateCompleted?: Date;
  locationId?: string;
  outcome?: string;
  voided: boolean;
  createdAt: Date;
  updatedAt: Date;
}