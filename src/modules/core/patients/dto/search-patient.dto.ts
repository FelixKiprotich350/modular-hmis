export class SearchPatientDto {
  name?: string;
  identifier?: string;
  phone?: string;
  gender?: string;
  birthdate?: Date;
  limit?: number = 20;
  offset?: number = 0;
}