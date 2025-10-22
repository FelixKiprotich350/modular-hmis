export interface Provider {
  id: string;
  personId?: string;
  identifier?: string;
  name?: string;
  retired: boolean;
  person?: Person;
  attributes?: ProviderAttribute[];
  roles?: ProviderRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex: string;
  gender: string;
  birthdate?: Date;
  birthdateEstimated?: boolean;
  dead?: boolean;
  deathDate?: Date;
  causeOfDeath?: string;
  deathCertificateNumber?: string;
  phone?: string;
  email?: string;
}

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