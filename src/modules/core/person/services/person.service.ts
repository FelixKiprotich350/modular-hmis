import { PrismaClient } from '@prisma/client';
import { Person, PersonAttribute } from '../models/person.model';

export class PersonService {
  constructor(private db: PrismaClient) {}

  async createPerson(data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<Person> {
    return {
      id: 'person_' + Date.now(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getPerson(id: string): Promise<Person | null> {
    return null;
  }

  async addAttribute(personId: string, attributeTypeId: string, value: string): Promise<PersonAttribute> {
    return {
      id: 'attr_' + Date.now(),
      personId,
      attributeTypeId,
      value,
      createdAt: new Date()
    };
  }
}