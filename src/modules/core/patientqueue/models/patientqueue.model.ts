export interface PatientQueue {
  id: string;
  patientId: string;
  providerId?: string;
  servicePointId?: string;
  queueType: string;
  priority: number;
  status: string;
  notes?: string;
  estimatedWaitTime?: number;
  actualWaitTime?: number;
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}