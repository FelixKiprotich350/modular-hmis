export interface Order {
  id: string;
  patientId: string;
  encounterId?: string;
  orderTypeId: string;
  conceptId: string;
  orderer: string;
  urgency: 'ROUTINE' | 'URGENT' | 'STAT';
  instructions?: string;
  startDate: Date;
  autoExpireDate?: Date;
  discontinued: boolean;
  discontinuedDate?: Date;
  discontinuedReason?: string;
  status: 'NEW' | 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderType {
  id: string;
  name: string;
  description?: string;
  javaClassName?: string;
  retired: boolean;
}