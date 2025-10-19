export interface Drug {
  id: string;
  name: string;
  genericName?: string;
  strength?: string;
  dosageForm: string;
  units?: string;
  concept?: string;
  retired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DrugOrder {
  id: string;
  patientId: string;
  drugId: string;
  orderId: string;
  dose?: number;
  doseUnits?: string;
  frequency?: string;
  quantity?: number;
  quantityUnits?: string;
  duration?: number;
  durationUnits?: string;
  route?: string;
  instructions?: string;
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';
  createdAt: Date;
  updatedAt: Date;
}