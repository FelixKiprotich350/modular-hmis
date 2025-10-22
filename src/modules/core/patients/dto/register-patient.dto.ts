import { ApiProperty } from '@nestjs/swagger';

export class PatientIdentifierDto {
  @ApiProperty()
  identifierTypeId: string;
  
  @ApiProperty({ required: false })
  identifier?: string;
  
  @ApiProperty({ required: false })
  preferred?: boolean;
}

export class PersonContactDto {
  @ApiProperty({ enum: ['phone', 'email', 'fax'] })
  type: 'phone' | 'email' | 'fax';
  
  @ApiProperty()
  value: string;
  
  @ApiProperty({ required: false })
  preferred?: boolean;
}

export class PersonAddressDto {
  @ApiProperty({ required: false })
  address1?: string;
  
  @ApiProperty({ required: false })
  address2?: string;
  
  @ApiProperty({ required: false })
  cityVillage?: string;
  
  @ApiProperty({ required: false })
  stateProvince?: string;
  
  @ApiProperty({ required: false })
  country?: string;
  
  @ApiProperty({ required: false })
  postalCode?: string;
  
  @ApiProperty({ required: false })
  countyDistrict?: string;
  
  @ApiProperty({ required: false })
  preferred?: boolean;
}

export class PersonAttributeDto {
  @ApiProperty()
  attributeTypeId: string;
  
  @ApiProperty()
  value: string;
}

export class NextOfKinDto {
  @ApiProperty()
  firstName: string;
  
  @ApiProperty()
  lastName: string;
  
  @ApiProperty({ required: false })
  middleName?: string;
  
  @ApiProperty()
  relationship: string;
  
  @ApiProperty({ required: false })
  priority?: number;
  
  @ApiProperty({ required: false })
  contactPhone?: string;
  
  @ApiProperty({ required: false })
  contactEmail?: string;
  
  @ApiProperty({ required: false })
  address?: string;
}

export class RelationshipPersonDto {
  @ApiProperty()
  firstName: string;
  
  @ApiProperty()
  lastName: string;
  
  @ApiProperty({ required: false })
  middleName?: string;
  
  @ApiProperty({ enum: ['M', 'F', 'O'] })
  gender: 'M' | 'F' | 'O';
  
  @ApiProperty({ required: false })
  birthdate?: Date;
}

export class RelationshipDto {
  @ApiProperty({ required: false })
  personBId?: string;
  
  @ApiProperty({ type: RelationshipPersonDto, required: false })
  personB?: RelationshipPersonDto;
  
  @ApiProperty()
  relationshipTypeId: string;
  
  @ApiProperty({ required: false })
  startDate?: Date;
}

export class RegisterPatientDto {
  @ApiProperty({ description: 'Patient first name' })
  firstName: string;
  
  @ApiProperty({ description: 'Patient last name' })
  lastName: string;
  
  @ApiProperty({ required: false, description: 'Patient middle name' })
  middleName?: string;
  
  @ApiProperty({ enum: ['M', 'F', 'O'], description: 'Patient gender' })
  gender: 'M' | 'F' | 'O';
  
  @ApiProperty({ required: false, description: 'Patient birth date' })
  birthdate?: Date;
  
  @ApiProperty({ required: false, description: 'Is birth date estimated' })
  birthdateEstimated?: boolean;
  
  @ApiProperty({ type: [PatientIdentifierDto], description: 'Patient identifiers' })
  identifiers: PatientIdentifierDto[];
  
  @ApiProperty({ type: [PersonContactDto], required: false, description: 'Contact information' })
  contacts?: PersonContactDto[];
  
  @ApiProperty({ type: [PersonAddressDto], required: false, description: 'Address information' })
  addresses?: PersonAddressDto[];
  
  @ApiProperty({ required: false, description: 'Is patient deceased' })
  dead?: boolean;
  
  @ApiProperty({ required: false, description: 'Date of death' })
  deathDate?: Date;
  
  @ApiProperty({ required: false, description: 'Cause of death' })
  causeOfDeath?: string;
  
  @ApiProperty({ required: false, description: 'Death certificate number' })
  deathCertificateNumber?: string;
  
  @ApiProperty({ type: [PersonAttributeDto], required: false, description: 'Additional attributes' })
  attributes?: PersonAttributeDto[];
  
  @ApiProperty({ type: [RelationshipDto], required: false, description: 'Patient relationships' })
  relationships?: RelationshipDto[];
  
  @ApiProperty({ type: [NextOfKinDto], required: false, description: 'Next of kin information' })
  nextOfKin?: NextOfKinDto[];
}