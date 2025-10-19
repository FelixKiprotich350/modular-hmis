export interface Encounter {
  id: string;
  patientId: string;
  providerId: string;
  locationId?: string;
  encounterType: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}