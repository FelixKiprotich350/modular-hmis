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

  async registerPatient(data: PatientRegistrationData): Promise<any> {
    const identifier = data.customIdentifier || await this.generatePatientId(data.identifierTypeId);
    
    const existing = await this.findDuplicates(data);
    if (existing.length > 0) {
      throw new Error(`Potential duplicate found: ${existing.length} similar patients`);
    }

    return await this.db.$transaction(async (tx) => {
      const person = await tx.person.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          gender: data.gender,
          birthdate: data.birthdate,
          birthdateEstimated: data.birthdateEstimated || false,
          dead: false
        }
      });

      const patient = await tx.patient.create({
        data: {
          personId: person.id,
          identifiers: {
            create: {
              identifierTypeId: data.identifierTypeId,
              identifier,
              preferred: true
            }
          }
        },
        include: {
          person: true,
          identifiers: true
        }
      });

      if (data.address1) {
        await tx.personAddress.create({
          data: {
            personId: person.id,
            preferred: true,
            address1: data.address1,
            address2: data.address2,
            cityVillage: data.cityVillage,
            stateProvince: data.stateProvince,
            country: data.country,
            postalCode: data.postalCode
          }
        });
      }

      return patient;
    });
  }

  async searchPatients(criteria: PatientSearchCriteria): Promise<any[]> {
    const where: any = {};
    
    if (criteria.identifier) {
      where.identifiers = {
        some: {
          identifier: {
            contains: criteria.identifier,
            mode: 'insensitive'
          }
        }
      };
    }
    
    if (criteria.name) {
      where.person = {
        OR: [
          { firstName: { contains: criteria.name, mode: 'insensitive' } },
          { lastName: { contains: criteria.name, mode: 'insensitive' } }
        ]
      };
    }
    
    if (criteria.gender) {
      where.person = { ...where.person, gender: criteria.gender };
    }
    
    return await this.db.patient.findMany({
      where,
      include: {
        person: true,
        identifiers: true
      },
      skip: criteria.offset || 0,
      take: criteria.limit || 20
    });
  }

  async findDuplicates(data: PatientRegistrationData): Promise<any[]> {
    const duplicates = await this.db.patient.findMany({
      where: {
        person: {
          AND: [
            { firstName: { equals: data.firstName, mode: 'insensitive' } },
            { lastName: { equals: data.lastName, mode: 'insensitive' } },
            data.birthdate ? { birthdate: data.birthdate } : {}
          ]
        }
      },
      include: {
        person: true,
        identifiers: true
      }
    });
    
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

  async getPatient(id: string): Promise<any> {
    return await this.db.patient.findUnique({
      where: { id },
      include: {
        person: {
          include: {
            addresses: true,
            attributes: true
          }
        },
        identifiers: true
      }
    });
  }

  async getPatientByIdentifier(identifier: string): Promise<any> {
    return await this.db.patient.findFirst({
      where: {
        identifiers: {
          some: {
            identifier
          }
        }
      },
      include: {
        person: true,
        identifiers: true
      }
    });
  }

  async addIdentifier(patientId: string, identifierTypeId: string, identifier: string): Promise<any> {
    return await this.db.patientIdentifier.create({
      data: {
        patientId,
        identifierTypeId,
        identifier,
        preferred: false
      }
    });
  }

  private async generatePatientId(identifierTypeId: string): Promise<string> {
    const count = await this.db.patient.count();
    return `P${(count + 1).toString().padStart(6, '0')}`;
  }

  async listPatients(): Promise<any[]> {
    return await this.db.patient.findMany({
      include: {
        person: true,
        identifiers: true
      },
      take: 50
    });
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient | null> {
    return null;
  }

  async deletePatient(id: string): Promise<boolean> {
    return true;
  }
}