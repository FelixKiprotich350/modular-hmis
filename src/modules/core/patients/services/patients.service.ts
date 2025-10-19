import { PrismaClient } from '@prisma/client';
import { Patient, PatientIdentifier, Person, PersonAddress } from '../models/patient.model';

export interface PatientRegistrationData {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'M' | 'F' | 'O';
  birthdate?: Date;
  birthdateEstimated?: boolean;
  phone?: string;
  email?: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  identifierTypeId: string;
  customIdentifier?: string;
}

export interface PatientSearchCriteria {
  name?: string;
  identifier?: string;
  phone?: string;
  gender?: string;
  birthdate?: Date;
  limit?: number;
  offset?: number;
}

export class PatientService {
  constructor(private db: PrismaClient) {}

  async registerPatient(data: PatientRegistrationData): Promise<Patient> {
    const personId = 'person_' + Date.now();
    const patientId = 'patient_' + Date.now();
    
    // Generate or use custom identifier
    const identifier = data.customIdentifier || await this.generatePatientId(data.identifierTypeId);
    
    // Check for duplicates
    const existing = await this.findDuplicates(data);
    if (existing.length > 0) {
      throw new Error(`Potential duplicate found: ${existing.length} similar patients`);
    }

    const patient: Patient = {
      id: patientId,
      personId,
      identifiers: [{
        id: 'ident_' + Date.now(),
        patientId,
        identifierTypeId: data.identifierTypeId,
        identifier,
        preferred: true,
        createdAt: new Date()
      }],
      person: {
        id: personId,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        gender: data.gender,
        birthdate: data.birthdate,
        birthdateEstimated: data.birthdateEstimated || false,
        dead: false,
        addresses: data.address1 ? [{
          id: 'addr_' + Date.now(),
          personId,
          preferred: true,
          address1: data.address1,
          address2: data.address2,
          cityVillage: data.cityVillage,
          stateProvince: data.stateProvince,
          country: data.country,
          postalCode: data.postalCode,
          createdAt: new Date()
        }] : [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return patient;
  }

  async searchPatients(criteria: PatientSearchCriteria): Promise<Patient[]> {
    const results: Patient[] = [];
    
    // Mock search implementation
    if (criteria.identifier) {
      const patient = await this.getPatientByIdentifier(criteria.identifier);
      if (patient) results.push(patient);
    }
    
    return results.slice(criteria.offset || 0, (criteria.offset || 0) + (criteria.limit || 20));
  }

  async findDuplicates(data: PatientRegistrationData): Promise<Patient[]> {
    // Mock duplicate detection
    const duplicates: Patient[] = [];
    
    // Check by name + birthdate
    if (data.firstName && data.lastName && data.birthdate) {
      // Would search for similar names and birthdates
    }
    
    // Check by phone
    if (data.phone) {
      // Would search for existing phone numbers
    }
    
    return duplicates;
  }

  async createPatient(personData: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>, identifierTypeId: string): Promise<Patient> {
    const registrationData: PatientRegistrationData = {
      firstName: personData.firstName,
      lastName: personData.lastName,
      middleName: personData.middleName,
      gender: personData.gender as 'M' | 'F' | 'O',
      birthdate: personData.birthdate,
      birthdateEstimated: personData.birthdateEstimated,
      identifierTypeId
    };
    
    return this.registerPatient(registrationData);
  }

  async getPatient(id: string): Promise<Patient | null> {
    return null;
  }

  async getPatientByIdentifier(identifier: string): Promise<Patient | null> {
    return null;
  }

  async addIdentifier(patientId: string, identifierTypeId: string, identifier: string): Promise<PatientIdentifier> {
    return {
      id: 'ident_' + Date.now(),
      patientId,
      identifierTypeId,
      identifier,
      preferred: false,
      createdAt: new Date()
    };
  }

  private async generatePatientId(identifierTypeId: string): Promise<string> {
    return 'P' + Date.now();
  }

  async listPatients(): Promise<Patient[]> {
    return [];
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient | null> {
    return null;
  }

  async deletePatient(id: string): Promise<boolean> {
    return true;
  }
}