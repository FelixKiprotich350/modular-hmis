export interface Billing {
  id: string;
  patientId: string;
  serviceCode: string;
  amount: number;
  description?: string;
  status: string;
  insuranceId?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}