export interface DataExport {
  id: string;
  name: string;
  description?: string;
  exportType: 'CSV' | 'JSON' | 'XML' | 'HL7';
  query?: string;
  schedule?: string;
  lastRun?: Date;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
}

export interface DataImport {
  id: string;
  name: string;
  sourceType: 'FILE' | 'API' | 'DATABASE';
  sourceConfig: any; // JSON configuration
  mappingConfig: any; // Field mapping configuration
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  recordsProcessed: number;
  recordsFailed: number;
  createdAt: Date;
}

export interface ETLJob {
  id: string;
  name: string;
  sourceConfig: any;
  transformConfig: any;
  targetConfig: any;
  schedule?: string;
  lastRun?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'RUNNING' | 'FAILED';
}