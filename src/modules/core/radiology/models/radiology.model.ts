export interface Radiology {
  id: string;
  patientId: string;
  encounterId?: string;
  orderId?: string;
  studyType: string;
  studyCode?: string;
  modality: string;
  bodyPart?: string;
  indication?: string;
  result?: string;
  impression?: string;
  findings?: string;
  status: 'ORDERED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  orderedBy: string;
  performedBy?: string;
  radiologist?: string;
  orderedAt: Date;
  scheduledAt?: Date;
  performedAt?: Date;
  reportedAt?: Date;
  imageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RadiologyStudy {
  id: string;
  name: string;
  code: string;
  modality: string;
  bodyPart: string;
  description?: string;
  retired: boolean;
}

export interface RadiologyModality {
  id: string;
  name: string;
  code: string;
  description?: string;
  retired: boolean;
}