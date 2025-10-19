export interface IdentifierSource {
  id: string;
  name: string;
  description?: string;
  identifierType: string;
  baseCharacterSet?: string;
  prefix?: string;
  suffix?: string;
  firstIdentifierBase?: string;
  minLength?: number;
  maxLength?: number;
  retired: boolean;
  createdAt: Date;
}

export interface PooledIdentifier {
  id: string;
  sourceId: string;
  identifier: string;
  used: boolean;
  dateUsed?: Date;
  comment?: string;
  createdAt: Date;
}

export interface IdentifierType {
  id: string;
  name: string;
  description?: string;
  format?: string;
  required: boolean;
  checkDigit: boolean;
  retired: boolean;
}