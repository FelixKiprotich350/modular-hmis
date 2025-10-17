import { PrismaClient } from '@prisma/client';

export class ConceptService {
  constructor(private db: PrismaClient) {}

  async createConcept(data: any) {
    return { id: 'concept_' + Date.now(), ...data };
  }

  async getConcept(id: string) {
    return null;
  }

  async listConcepts() {
    return [];
  }
}