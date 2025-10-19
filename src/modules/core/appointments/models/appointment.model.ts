export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  locationId?: string;
  appointmentDate: Date;
  appointmentTime: string;
  reason?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}