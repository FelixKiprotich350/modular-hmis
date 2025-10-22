export interface Patient {
  id: string;
  personId: string;
  identifiers: PatientIdentifier[];
  person?: Person;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientIdentifier {
  id: string;
  patientId: string;
  identifierTypeId: string;
  identifier: string;
  preferred: boolean;
  locationId?: string;
  createdAt: Date;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex: string;
  gender: string;
  birthdate?: Date;
  birthdateEstimated: boolean;
  dead: boolean;
  deathDate?: Date;
  causeOfDeath?: string;
  deathCertificateNumber?: string;
  addresses?: PersonAddress[];
  attributes?: PersonAttribute[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonAddress {
  id: string;
  personId: string;
  preferred: boolean;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}

export interface PersonAttribute {
  id: string;
  personId: string;
  attributeTypeId: string;
  value: string;
  createdAt: Date;
}