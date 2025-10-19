export interface Prescription {
  id: string;
  patientId: string;
  prescriberId: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  instructions?: string;
  status: string;
  dispensedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}