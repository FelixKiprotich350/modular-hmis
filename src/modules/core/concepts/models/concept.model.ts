export interface Concept {
  id: string;
  name: string;
  datatype: 'Text' | 'Numeric' | 'Coded' | 'Date' | 'Boolean' | 'Complex';
  conceptClass?: string;
  units?: string;
  description?: string;
  retired: boolean;
  answers?: ConceptAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConceptAnswer {
  id: string;
  conceptId: string;
  answerConcept: string;
  sortWeight?: number;
}

export interface ConceptDatatype {
  TEXT: 'Text';
  NUMERIC: 'Numeric';
  CODED: 'Coded';
  DATE: 'Date';
  BOOLEAN: 'Boolean';
  COMPLEX: 'Complex';
}