import { PrismaClient } from '@prisma/client';

export interface ClinicalVisitData {
  patientId: string;
  providerId: string;
  locationId?: string;
  visitType: string;
  encounterType: string;
  observations?: {
    conceptId: string;
    value: string;
    units?: string;
  }[];
  orders?: {
    orderTypeId: string;
    conceptId: string;
    instructions?: string;
  }[];
  drugOrders?: {
    drugId: string;
    dose?: number;
    frequency?: string;
    duration?: number;
  }[];
}

export class ClinicalWorkflowService {
  constructor(private db: PrismaClient) {}

  async createCompleteVisit(data: ClinicalVisitData): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      // 1. Start visit
      const visit = await tx.visit.create({
        data: {
          patientId: data.patientId,
          visitType: data.visitType,
          startDate: new Date()
        }
      });

      // 2. Create encounter
      const encounter = await tx.encounter.create({
        data: {
          patientId: data.patientId,
          providerId: data.providerId,
          locationId: data.locationId,
          encounterType: data.encounterType,
          startDate: new Date()
        }
      });

      // 3. Link encounter to visit
      await tx.visit.update({
        where: { id: visit.id },
        data: { encounterId: encounter.id }
      });

      // 4. Create observations if provided
      const observations = [];
      if (data.observations?.length) {
        for (const obs of data.observations) {
          const observation = await tx.observation.create({
            data: {
              patientId: data.patientId,
              encounterId: encounter.id,
              conceptId: obs.conceptId,
              value: obs.value,
              units: obs.units,
              obsDate: new Date()
            }
          });
          observations.push(observation);
        }
      }

      // 5. Create orders if provided
      const orders = [];
      if (data.orders?.length) {
        for (const order of data.orders) {
          const createdOrder = await tx.order.create({
            data: {
              patientId: data.patientId,
              encounterId: encounter.id,
              orderTypeId: order.orderTypeId,
              conceptId: order.conceptId,
              orderer: data.providerId,
              instructions: order.instructions,
              startDate: new Date(),
              status: 'NEW'
            }
          });
          orders.push(createdOrder);
        }
      }

      // 6. Create drug orders if provided
      const drugOrders = [];
      if (data.drugOrders?.length) {
        for (const drugOrder of data.drugOrders) {
          const createdDrugOrder = await tx.drugOrder.create({
            data: {
              patientId: data.patientId,
              drugId: drugOrder.drugId,
              dose: drugOrder.dose,
              frequency: drugOrder.frequency,
              duration: drugOrder.duration,
              startDate: new Date(),
              status: 'ACTIVE'
            }
          });
          drugOrders.push(createdDrugOrder);
        }
      }

      return {
        visit,
        encounter,
        observations,
        orders,
        drugOrders
      };
    });
  }

  async enrollPatientInProgram(patientId: string, programId: string, locationId?: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      // Check if already enrolled
      const existing = await tx.programEnrollment.findFirst({
        where: {
          patientId,
          programId,
          dateCompleted: null,
          voided: false
        }
      });

      if (existing) {
        throw new Error('Patient already enrolled in this program');
      }

      // Create enrollment
      const enrollment = await tx.programEnrollment.create({
        data: {
          patientId,
          programId,
          dateEnrolled: new Date(),
          locationId
        }
      });

      // Add to program cohort if exists
      const programCohort = await tx.cohort.findFirst({
        where: {
          name: { contains: 'Program', mode: 'insensitive' }
        }
      });

      if (programCohort) {
        await tx.cohortMember.create({
          data: {
            cohortId: programCohort.id,
            patientId,
            startDate: new Date()
          }
        });
      }

      return enrollment;
    });
  }

  async transferPatientCare(patientId: string, fromProviderId: string, toProviderId: string, reason: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      // Close active encounters with old provider
      await tx.encounter.updateMany({
        where: {
          patientId,
          providerId: fromProviderId,
          endDate: null
        },
        data: {
          endDate: new Date(),
          notes: `Transfer: ${reason}`
        }
      });

      // Update active appointments
      await tx.appointment.updateMany({
        where: {
          patientId,
          providerId: fromProviderId,
          status: 'scheduled'
        },
        data: {
          providerId: toProviderId,
          reason: `Provider transfer: ${reason}`
        }
      });

      // Create transfer record (using observation for audit)
      const transferConcept = await tx.concept.findFirst({
        where: { name: 'Provider Transfer' }
      });

      if (transferConcept) {
        await tx.observation.create({
          data: {
            patientId,
            conceptId: transferConcept.id,
            value: `From: ${fromProviderId} To: ${toProviderId}`,
            notes: reason,
            obsDate: new Date()
          }
        });
      }

      return { success: true, reason };
    });
  }

  async dischargePatient(patientId: string, providerId: string, dischargeNotes?: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      // End active visit
      await tx.visit.updateMany({
        where: {
          patientId,
          endDate: null
        },
        data: {
          endDate: new Date(),
          notes: dischargeNotes
        }
      });

      // Close active encounters
      await tx.encounter.updateMany({
        where: {
          patientId,
          providerId,
          endDate: null
        },
        data: {
          endDate: new Date(),
          notes: `Discharge: ${dischargeNotes || 'Patient discharged'}`
        }
      });

      // Cancel future appointments
      await tx.appointment.updateMany({
        where: {
          patientId,
          appointmentDate: { gte: new Date() },
          status: 'scheduled'
        },
        data: {
          status: 'cancelled',
          reason: 'Patient discharged'
        }
      });

      return { discharged: true, dischargeDate: new Date() };
    });
  }
}