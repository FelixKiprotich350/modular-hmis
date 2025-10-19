export interface Visit {
  id: string;
  patientId: string;
  visitType: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  encounters?: Encounter[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VisitType {
  id: string;
  name: string;
  description?: string;
  retired: boolean;
}

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