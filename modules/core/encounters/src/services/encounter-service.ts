import { PrismaClient } from '@prisma/client';

export class EncounterService {
  constructor(private db: PrismaClient) {}

  async createEncounter(data: any) {
    return { id: 'encounter_' + Date.now(), ...data };
  }

  async getEncounter(id: string) {
    return null;
  }

  async getPatientEncounters(patientId: string) {
    return [];
  }
}