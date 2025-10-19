export interface Report {
  id: string;
  title: string;
  type: string;
  parameters?: any;
  generatedBy: string;
  filePath?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}