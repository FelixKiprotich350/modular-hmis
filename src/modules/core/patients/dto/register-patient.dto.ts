export class RegisterPatientDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'M' | 'F' | 'O';
  birthdate?: Date;
  birthdateEstimated?: boolean;
  phone?: string;
  email?: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  identifierTypeId: string;
  customIdentifier?: string;
}