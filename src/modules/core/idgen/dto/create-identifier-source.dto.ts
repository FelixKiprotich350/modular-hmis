export class CreateIdentifierSourceDto {
  name: string;
  description?: string;
  identifierType: string;
  baseCharacterSet?: string;
  prefix?: string;
  suffix?: string;
  firstIdentifierBase?: string;
  minLength?: number;
  maxLength?: number;
  retired: boolean = false;
}