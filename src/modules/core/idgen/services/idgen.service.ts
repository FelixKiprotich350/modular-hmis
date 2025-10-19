import { PrismaClient } from '@prisma/client';
import { IdentifierSource, PooledIdentifier, IdentifierType } from '../models/idgen.model';

export class IdgenService {
  constructor(private db: PrismaClient) {}

  async generateIdentifier(sourceId: string): Promise<string> {
    // Try to get from pool first
    const pooled = await this.getFromPool(sourceId);
    if (pooled) return pooled;
    
    // Get source configuration
    const source = await this.getIdentifierSource(sourceId);
    if (!source) {
      throw new Error(`Identifier source ${sourceId} not found`);
    }
    
    // Generate based on source configuration
    let identifier = '';
    
    if (source.prefix) identifier += source.prefix;
    
    // Generate sequential or random part
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    identifier += timestamp + random;
    
    if (source.suffix) identifier += source.suffix;
    
    // Apply length constraints
    if (source.minLength && identifier.length < source.minLength) {
      identifier = identifier.padStart(source.minLength, '0');
    }
    if (source.maxLength && identifier.length > source.maxLength) {
      identifier = identifier.substring(0, source.maxLength);
    }
    
    return identifier;
  }

  async getIdentifierSource(sourceId: string): Promise<IdentifierSource | null> {
    // Mock implementation - would query database
    return {
      id: sourceId,
      name: 'Default Patient ID Source',
      identifierType: 'patient-id',
      prefix: 'P',
      minLength: 8,
      maxLength: 12,
      retired: false,
      createdAt: new Date()
    };
  }

  async createIdentifierSource(data: Omit<IdentifierSource, 'id' | 'createdAt'>): Promise<IdentifierSource> {
    return {
      id: 'source_' + Date.now(),
      ...data,
      createdAt: new Date()
    };
  }

  async createIdentifierType(data: Omit<IdentifierType, 'id'>): Promise<IdentifierType> {
    return {
      id: 'type_' + Date.now(),
      ...data
    };
  }

  async getNextIdentifier(sourceId: string): Promise<string> {
    return this.generateIdentifier(sourceId);
  }

  async reserveIdentifiers(sourceId: string, count: number): Promise<string[]> {
    const identifiers = [];
    for (let i = 0; i < count; i++) {
      const id = await this.generateIdentifier(sourceId);
      await this.addToPool(sourceId, id);
      identifiers.push(id);
    }
    return identifiers;
  }

  async validateIdentifier(identifier: string, typeId: string): Promise<boolean> {
    if (!identifier || identifier.length === 0) return false;
    // Add format validation based on identifier type
    return true;
  }

  async addToPool(sourceId: string, identifier: string): Promise<PooledIdentifier> {
    return {
      id: 'pool_' + Date.now(),
      sourceId,
      identifier,
      used: false,
      createdAt: new Date()
    };
  }

  async getFromPool(sourceId: string): Promise<string | null> {
    // Mock implementation - would query unused pooled identifiers
    return null;
  }

  async markAsUsed(identifier: string): Promise<boolean> {
    return true;
  }

  async getIdentifierSources(): Promise<IdentifierSource[]> {
    return [];
  }

  async getIdentifierTypes(): Promise<IdentifierType[]> {
    return [];
  }
}