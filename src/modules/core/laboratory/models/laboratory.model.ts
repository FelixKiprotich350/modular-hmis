export interface Laboratory {
  id: string;
  patientId: string;
  testName: string;
  result?: string;
  status: string;
  orderedAt: Date;
  resultAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}