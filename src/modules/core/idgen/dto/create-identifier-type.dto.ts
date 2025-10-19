export class CreateIdentifierTypeDto {
  name: string;
  description?: string;
  format?: string;
  required: boolean = false;
  checkDigit: boolean = false;
  retired: boolean = false;
}