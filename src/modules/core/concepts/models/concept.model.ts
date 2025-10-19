export interface Concept {
  id: string;
  name: string;
  datatype: string;
  units?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}