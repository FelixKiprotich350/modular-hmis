import { PrismaClient } from '@prisma/client';
import { Concept, ConceptAnswer } from '../models/concept.model';

export class ConceptService {
  constructor(private db: PrismaClient) {}

  async createConcept(data: Omit<Concept, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const { answers, ...conceptData } = data;
    return await this.db.concept.create({
      data: conceptData as any
    });
  }

  async getConcept(id: string): Promise<any> {
    return await this.db.concept.findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            answer: true
          }
        }
      }
    });
  }

  async getConceptByName(name: string): Promise<any> {
    return await this.db.concept.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });
  }

  async searchConcepts(query: string, datatype?: string): Promise<any[]> {
    const where: any = {
      name: {
        contains: query,
        mode: 'insensitive'
      },
      retired: false
    };
    
    if (datatype) {
      where.datatype = datatype;
    }
    
    return await this.db.concept.findMany({
      where,
      take: 50
    });
  }

  async addConceptAnswer(conceptId: string, answerConceptId: string, sortWeight?: number): Promise<any> {
    return await this.db.conceptAnswer.create({
      data: {
        conceptId,
        answerConcept: answerConceptId,
        sortWeight
      }
    });
  }

  async getConceptAnswers(conceptId: string): Promise<any[]> {
    return await this.db.conceptAnswer.findMany({
      where: { conceptId },
      include: {
        answer: true
      }
    });
  }

  async getConceptsByClass(conceptClass: string): Promise<any[]> {
    return await this.db.concept.findMany({
      where: {
        conceptClass,
        retired: false
      }
    });
  }

  async getConceptsByDatatype(datatype: string): Promise<any[]> {
    return await this.db.concept.findMany({
      where: {
        datatype,
        retired: false
      }
    });
  }

  async listConcepts(): Promise<any[]> {
    return await this.db.concept.findMany({
      where: {
        retired: false
      },
      take: 100
    });
  }

  async updateConcept(id: string, data: Partial<Concept>): Promise<Concept | null> {
    return null;
  }

  async deleteConcept(id: string): Promise<boolean> {
    return true;
  }
}