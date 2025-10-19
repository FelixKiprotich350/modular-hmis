export interface TelemedicineSession {
  id: string;
  patientId: string;
  providerId: string;
  sessionUrl?: string;
  startTime: Date;
  endTime?: Date;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}