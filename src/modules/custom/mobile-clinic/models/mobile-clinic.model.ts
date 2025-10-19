export interface MobileClinic {
  id: string;
  name: string;
  location: string;
  schedule?: any;
  services: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}