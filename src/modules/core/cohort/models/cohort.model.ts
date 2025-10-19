export interface Cohort {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CohortMember {
  id: string;
  cohortId: string;
  patientId: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}

export interface CohortDefinition {
  id: string;
  name: string;
  description?: string;
  definition: string; // JSON query definition
  evaluationClass?: string;
  retired: boolean;
  createdAt: Date;
}

export interface CohortType {
  id: string;
  name: string;
  description?: string;
  retired: boolean;
}