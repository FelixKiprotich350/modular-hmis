import { PrismaClient } from '@prisma/client';
import { IdentifierSource, PooledIdentifier } from '../models/idgen.model';

export class IdgenService {
  constructor(private db: PrismaClient) {}

  async generateIdentifier(sourceId: string): Promise<string> {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ID${timestamp}${random}`;
  }

  async createIdentifierSource(data: Omit<IdentifierSource, 'id' | 'createdAt'>): Promise<IdentifierSource> {
    return {
      id: 'source_' + Date.now(),
      ...data,
      createdAt: new Date()
    };
  }

  async getNextIdentifier(sourceId: string): Promise<string> {
    return this.generateIdentifier(sourceId);
  }

  async reserveIdentifiers(sourceId: string, count: number): Promise<string[]> {
    return Array.from({ length: count }, () => this.generateIdentifier(sourceId));
  }

  async validateIdentifier(identifier: string, typeId: string): Promise<boolean> {
    return identifier.length > 0;
  }
}