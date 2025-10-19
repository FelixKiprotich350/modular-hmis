export interface Visit {
  id: string;
  patientId: string;
  encounterId?: string;
  visitType: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}