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

export interface Concept {
  id: string;
  name: string;
  datatype: string;
  units?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}