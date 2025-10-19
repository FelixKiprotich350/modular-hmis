export interface Insurance {
  id: string;
  policyNumber: string;
  provider: string;
  policyHolder: string;
  coverage?: any;
  createdAt: Date;
  updatedAt: Date;
}