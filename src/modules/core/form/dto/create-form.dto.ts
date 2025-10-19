export class CreateFormDto {
  name: string;
  version: string;
  description?: string;
  encounterType?: string;
  published?: boolean = false;
  retired?: boolean = false;
}