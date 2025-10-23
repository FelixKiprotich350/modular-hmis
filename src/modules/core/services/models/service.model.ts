export interface ServiceCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  code: string;
  description?: string;
  categoryId: string;
  duration?: number; // in minutes
  price?: number;
  active: boolean;
  category?: ServiceCategory;
  createdAt: Date;
  updatedAt: Date;
}