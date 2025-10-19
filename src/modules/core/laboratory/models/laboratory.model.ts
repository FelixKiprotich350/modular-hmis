export interface Laboratory {
  id: string;
  patientId: string;
  encounterId?: string;
  orderId?: string;
  testName: string;
  testCode?: string;
  specimenType?: string;
  result?: string;
  resultValue?: string;
  resultUnits?: string;
  referenceRange?: string;
  abnormal?: boolean;
  status: 'ORDERED' | 'COLLECTED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  orderedBy: string;
  performedBy?: string;
  orderedAt: Date;
  collectedAt?: Date;
  resultAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LabTest {
  id: string;
  name: string;
  code: string;
  category: string;
  specimenType: string;
  units?: string;
  referenceRange?: string;
  retired: boolean;
}

export interface LabSpecimen {
  id: string;
  patientId: string;
  specimenType: string;
  collectionDate: Date;
  collectedBy: string;
  status: 'COLLECTED' | 'PROCESSING' | 'PROCESSED';
  barcode?: string;
  createdAt: Date;
}