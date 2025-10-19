export class CreateConceptDto {
  name: string;
  datatype: 'Text' | 'Numeric' | 'Coded' | 'Date' | 'Boolean' | 'Complex';
  conceptClass?: string;
  description?: string;
  units?: string;
  retired?: boolean = false;
}