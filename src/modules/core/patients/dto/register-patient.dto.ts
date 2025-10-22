export class PatientIdentifierDto {
  identifierTypeId: string;
  identifier?: string;
  preferred?: boolean;
}

export class PersonContactDto {
  type: 'phone' | 'email' | 'fax';
  value: string;
  preferred?: boolean;
}

export class PersonAddressDto {
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  preferred?: boolean;
}

export class PersonAttributeDto {
  attributeTypeId: string;
  value: string;
}

export class NextOfKinDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  relationship: string;
  priority?: number;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
}

export class RelationshipDto {
  personBId?: string; // If existing person
  personB?: { // If new person
    firstName: string;
    lastName: string;
    middleName?: string;
    gender: 'M' | 'F' | 'O';
    birthdate?: Date;
  };
  relationshipTypeId: string;
  startDate?: Date;
}

export class RegisterPatientDto {
  // Basic Info
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'M' | 'F' | 'O';
  birthdate?: Date;
  birthdateEstimated?: boolean;
  
  // Identifiers (part of basic info)
  identifiers: PatientIdentifierDto[];
  
  // Contact Details
  contacts?: PersonContactDto[];
  
  // Demographics (addresses)
  addresses?: PersonAddressDto[];
  
  // Death Info
  dead?: boolean;
  deathDate?: Date;
  causeOfDeath?: string;
  deathCertificateNumber?: string;
  
  // Additional attributes
  attributes?: PersonAttributeDto[];
  
  // Relationships
  relationships?: RelationshipDto[];
  
  // Next of Kin
  nextOfKin?: NextOfKinDto[];
}