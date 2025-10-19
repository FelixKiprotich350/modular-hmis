export class CreateProviderDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: string;
  birthdate?: Date;
  phone?: string;
  email?: string;
  identifier?: string;
}