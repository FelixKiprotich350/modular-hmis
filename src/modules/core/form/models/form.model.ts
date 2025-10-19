export interface Form {
  id: string;
  name: string;
  version: string;
  description?: string;
  encounterType?: string;
  template?: string;
  xslt?: string;
  published: boolean;
  retired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  id: string;
  formId: string;
  fieldNumber: number;
  fieldPart?: string;
  pageNumber?: number;
  minOccurs?: number;
  maxOccurs?: number;
  required: boolean;
  sortWeight?: number;
}

export interface Field {
  id: string;
  name: string;
  description?: string;
  fieldType: string;
  concept?: string;
  tableName?: string;
  attributeName?: string;
  defaultValue?: string;
  selectMultiple: boolean;
  retired: boolean;
}