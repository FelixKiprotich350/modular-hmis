export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}