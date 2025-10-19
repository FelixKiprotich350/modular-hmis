export interface MetadataPackage {
  id: string;
  name: string;
  description?: string;
  version: string;
  groupUuid?: string;
  published: boolean;
  dateCreated: Date;
  openmrsVersion?: string;
  metadata: any; // JSON metadata content
}

export interface MetadataSharing {
  id: string;
  name: string;
  description?: string;
  url?: string;
  enabled: boolean;
  createdAt: Date;
}

export interface ImportedPackage {
  id: string;
  packageId: string;
  importedBy: string;
  importedAt: Date;
  version: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
}