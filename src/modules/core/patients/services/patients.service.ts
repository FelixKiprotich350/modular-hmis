import { PrismaClient } from "@prisma/client";
import {
  Patient,
  PatientIdentifier,
  Person,
  PersonAddress,
} from "../models/patient.model";
import { RegisterPatientDto } from "../dto/register-patient.dto";

export interface PatientRegistrationData extends RegisterPatientDto {}

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
    const existing = await this.findDuplicates(data);
    if (existing.length > 0) {
      throw new Error(
        `Potential duplicate found: ${existing.length} similar patients`
      );
    }

    return await this.db.$transaction(async (tx) => {
      // Create person
      const person = await tx.person.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          sex: data.sex,
          gender: data.gender,
          birthdate: data.birthdate,
          birthdateEstimated: data.birthdateEstimated || false,
          dead: data.dead || false,
          deathDate: data.deathDate,
          causeOfDeath: data.causeOfDeath,
          deathCertificateNumber: data.deathCertificateNumber,
        },
      });

      // Create patient with identifiers
      const identifiersData = [];
      for (let i = 0; i < data.identifiers.length; i++) {
        const id = data.identifiers[i];
        identifiersData.push({
          identifierTypeId: id.identifierTypeId,
          identifier:
            id.identifier ||
            (await this.generatePatientId(id.identifierTypeId)),
          preferred: id.preferred ?? i === 0,
        });
      }

      const patient = await tx.patient.create({
        data: {
          personId: person.id,
          identifiers: {
            create: identifiersData,
          },
        },
        include: {
          person: true,
          identifiers: true,
        },
      });

      // Create addresses
      if (data.addresses?.length) {
        await tx.personAddress.createMany({
          data: data.addresses.map((addr, index) => ({
            personId: person.id,
            preferred: addr.preferred ?? index === 0,
            address1: addr.address1,
            address2: addr.address2,
            cityVillage: addr.cityVillage,
            stateProvince: addr.stateProvince,
            country: addr.country,
            postalCode: addr.postalCode,
            countyDistrict: addr.countyDistrict,
          })),
        });
      }

      // Create contacts
      if (data.contacts?.length) {
        await tx.personContact.createMany({
          data: data.contacts.map((contact) => ({
            personId: person.id,
            type: contact.type,
            value: contact.value,
            preferred: contact.preferred || false,
          })),
        });
      }

      // Create attributes
      if (data.attributes?.length) {
        await tx.personAttribute.createMany({
          data: data.attributes.map((attr) => ({
            personId: person.id,
            attributeTypeId: attr.attributeTypeId,
            value: attr.value,
          })),
        });
      }

      // Create relationships
      if (data.relationships?.length) {
        for (const rel of data.relationships) {
          let personBId = rel.personBId;

          if (!personBId && rel.personB) {
            const relatedPerson = await tx.person.create({
              data: {
                firstName: rel.personB.firstName,
                lastName: rel.personB.lastName,
                middleName: rel.personB.middleName,
                sex: rel.personB.sex,
                gender: rel.personB.gender,
                birthdate: rel.personB.birthdate,
              },
            });
            personBId = relatedPerson.id;
          }

          if (personBId) {
            await tx.relationship.create({
              data: {
                personAId: person.id,
                personBId,
                relationshipTypeId: rel.relationshipTypeId,
                startDate: rel.startDate,
              },
            });
          }
        }
      }

      // Create next of kin
      if (data.nextOfKin?.length) {
        for (const nok of data.nextOfKin) {
          const nokPerson = await tx.person.create({
            data: {
              firstName: nok.firstName,
              lastName: nok.lastName,
              middleName: nok.middleName,
              sex: "U", // Default sex for next of kin
              gender: "Man", // Default gender for next of kin
            },
          });

          await tx.nextOfKin.create({
            data: {
              patientPersonId: person.id,
              nextOfKinPersonId: nokPerson.id,
              relationship: nok.relationship,
              priority: nok.priority || 1,
              contactPhone: nok.contactPhone,
              contactEmail: nok.contactEmail,
              address: nok.address,
            },
          });
        }
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
            mode: "insensitive",
          },
        },
      };
    }

    if (criteria.name) {
      where.person = {
        OR: [
          { firstName: { contains: criteria.name, mode: "insensitive" } },
          { lastName: { contains: criteria.name, mode: "insensitive" } },
        ],
      };
    }

    if (criteria.gender) {
      where.person = { ...where.person, gender: criteria.gender };
    }

    return await this.db.patient.findMany({
      where,
      include: {
        person: true,
        identifiers: true,
      },
      skip: criteria.offset || 0,
      take: criteria.limit || 20,
    });
  }

  async findDuplicates(data: PatientRegistrationData): Promise<any[]> {
    const duplicates = await this.db.patient.findMany({
      where: {
        person: {
          AND: [
            { firstName: { equals: data.firstName, mode: "insensitive" } },
            { lastName: { equals: data.lastName, mode: "insensitive" } },
            data.birthdate ? { birthdate: data.birthdate } : {},
          ],
        },
      },
      include: {
        person: true,
        identifiers: true,
      },
    });

    return duplicates;
  }

  async createPatient(
    personData: Omit<Person, "id" | "createdAt" | "updatedAt">,
    identifierTypeId: string
  ): Promise<Patient> {
    const registrationData: PatientRegistrationData = {
      firstName: personData.firstName,
      lastName: personData.lastName,
      middleName: personData.middleName,
      sex: personData.sex as "M" | "F" | "U" | "O",
      gender: personData.gender as "Man" | "Woman" | "Transgender",
      birthdate: personData.birthdate,
      birthdateEstimated: personData.birthdateEstimated,
      identifiers: [{ identifierTypeId, preferred: true }],
    };

    return this.registerPatient(registrationData);
  }

  async getPatient(
    id: string,
    options?: { type: string; data: any }
  ): Promise<any> {
    const query: any = {
      where: { id },
    };

    // Default to including person details
    query.include = {
      person: {
        include: {
          addresses: true,
          attributes: {
            include: {
              attributeType: true,
            },
          },
          contacts: true,
          relationships: {
            include: {
              personB: true,
              relationshipType: true,
            },
          },
          nextOfKin: {
            include: {
              nextOfKinPerson: true,
            },
          },
        },
      },
    };

    if (options?.type === "custom" && options.data) {
      query.select = options.data;
    } else if (options?.type === "full") {
      query.include = {
        person: {
          include: {
            addresses: true,
            attributes: {
              include: {
                attributeType: true,
              },
            },
            contacts: true,
            relationships: {
              include: {
                personB: true,
                relationshipType: true,
              },
            },
            nextOfKin: {
              include: {
                nextOfKinPerson: true,
              },
            },
          },
        },
        identifiers: {
          include: {
            identifierType: true,
          },
        },
      };
    }

    return await this.db.patient.findUnique(query);
  }

  async getPatientByIdentifier(identifier: string): Promise<any> {
    return await this.db.patient.findFirst({
      where: {
        identifiers: {
          some: {
            identifier,
          },
        },
      },
      include: {
        person: true,
        identifiers: true,
      },
    });
  }

  async addIdentifier(
    patientId: string,
    identifierTypeId: string,
    identifier: string
  ): Promise<any> {
    return await this.db.patientIdentifier.create({
      data: {
        patientId,
        identifierTypeId,
        identifier,
        preferred: false,
      },
    });
  }

  private async generatePatientId(identifierTypeId: string): Promise<string> {
    const count = await this.db.patient.count();
    return `P${(count + 1).toString().padStart(6, "0")}`;
  }

  async listPatients(options?: { type: string; data: any }): Promise<any[]> {
    const query: any = {
      take: 50,
    };
    // Default to including person details
    query.include = {
      person: true,
    };

    if (options?.type === "custom" && options.data) {
      query.select = options.data;
    } else if (options?.type === "full") {
      query.include = {
        identifiers: true,
      };
    }

    return await this.db.patient.findMany(query);
  }

  async updatePatient(
    id: string,
    data: Partial<Patient>
  ): Promise<Patient | null> {
    return null;
  }

  async deletePatient(id: string): Promise<boolean> {
    return true;
  }
}
