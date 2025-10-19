export interface Radiology {
  id: string;
  patientId: string;
  studyType: string;
  result?: string;
  status: string;
  orderedAt: Date;
  resultAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}