export interface ProviderAttribute {
  id: string;
  providerId: string;
  attributeTypeId: string;
  value: string;
  createdAt: Date;
}

export interface ProviderAttributeType {
  id: string;
  name: string;
  description?: string;
  datatype: string;
  minOccurs: number;
  maxOccurs?: number;
  retired: boolean;
}

export interface ProviderRole {
  id: string;
  role: string;
  description?: string;
  relationshipTypes?: string[];
  superviseeProviderRoles?: string[];
  retired: boolean;
}

export interface ProviderManagement {
  id: string;
  providerId: string;
  providerRoleId: string;
  locationId?: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}