export interface Observation {
  id: string;
  patientId: string;
  encounterId?: string;
  conceptId: string;
  value: string;
  valueNumeric?: number;
  valueText?: string;
  valueDatetime?: Date;
  valueBoolean?: boolean;
  units?: string;
  notes?: string;
  obsDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ObservationGroup {
  id: string;
  patientId: string;
  encounterId?: string;
  conceptId: string;
  observations: Observation[];
  obsDate: Date;
  createdAt: Date;
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