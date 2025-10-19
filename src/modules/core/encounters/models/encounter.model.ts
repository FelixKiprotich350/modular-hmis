export interface Encounter {
  id: string;
  patientId: string;
  providerId: string;
  locationId?: string;
  encounterType: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  observations?: Observation[];
  visits?: Visit[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EncounterType {
  id: string;
  name: string;
  description?: string;
  retired: boolean;
}

export interface Observation {
  id: string;
  patientId: string;
  encounterId?: string;
  conceptId: string;
  value: string;
  units?: string;
  notes?: string;
  obsDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Visit {
  id: string;
  patientId: string;
  encounterId?: string;
  visitType: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  encounters?: Encounter[];
  createdAt: Date;
  updatedAt: Date;
}