export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'M' | 'F' | 'O';
  birthdate?: Date;
  birthdateEstimated: boolean;
  dead: boolean;
  deathDate?: Date;
  causeOfDeath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonAttribute {
  id: string;
  personId: string;
  attributeTypeId: string;
  value: string;
  createdAt: Date;
}

export interface PersonAttributeType {
  id: string;
  name: string;
  description?: string;
  format: string;
  required: boolean;
}

export interface PersonAddress {
  id: string;
  personId: string;
  address1: string;
  address2?: string;
  cityVillage: string;
  stateProvince?: string;
  country: string;
  postalCode?: string;
  preferred: boolean;
  createdAt: Date;
}