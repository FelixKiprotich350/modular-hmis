import { Injectable } from '@nestjs/common';

@Injectable()
export class FhirTransformerService {
  // Transform internal patient to FHIR Patient
  patientToFhir(patient: any): any {
    return {
      resourceType: 'Patient',
      id: patient.id,
      identifier: patient.identifiers?.map(id => ({
        use: id.preferred ? 'usual' : 'secondary',
        value: id.identifier,
        type: { text: id.identifierType.name }
      })),
      name: [{
        use: 'official',
        family: patient.person.lastName,
        given: [patient.person.firstName, patient.person.middleName].filter(Boolean)
      }],
      gender: patient.person.gender?.toLowerCase(),
      birthDate: patient.person.birthdate?.toISOString().split('T')[0],
      deceasedBoolean: patient.person.dead,
      address: patient.person.addresses?.map(addr => ({
        use: addr.preferred ? 'home' : 'temp',
        line: [addr.address1, addr.address2].filter(Boolean),
        city: addr.cityVillage,
        state: addr.stateProvince,
        postalCode: addr.postalCode,
        country: addr.country
      }))
    };
  }

  // Transform FHIR Patient to internal format
  fhirToPatient(fhirPatient: any): any {
    const name = fhirPatient.name?.[0] || {};
    return {
      person: {
        firstName: name.given?.[0] || '',
        lastName: name.family || '',
        middleName: name.given?.[1],
        gender: fhirPatient.gender?.toUpperCase(),
        birthdate: fhirPatient.birthDate ? new Date(fhirPatient.birthDate) : null,
        dead: fhirPatient.deceasedBoolean || false
      },
      identifiers: fhirPatient.identifier?.map(id => ({
        identifier: id.value,
        preferred: id.use === 'usual'
      }))
    };
  }

  // Transform internal encounter to FHIR Encounter
  encounterToFhir(encounter: any): any {
    return {
      resourceType: 'Encounter',
      id: encounter.id,
      status: encounter.endDate ? 'finished' : 'in-progress',
      class: { code: encounter.encounterType },
      subject: { reference: `Patient/${encounter.patientId}` },
      participant: [{
        individual: { reference: `Practitioner/${encounter.providerId}` }
      }],
      period: {
        start: encounter.startDate.toISOString(),
        end: encounter.endDate?.toISOString()
      },
      location: encounter.locationId ? [{
        location: { reference: `Location/${encounter.locationId}` }
      }] : undefined
    };
  }

  // Transform FHIR Encounter to internal format
  fhirToEncounter(fhirEncounter: any): any {
    return {
      startDate: new Date(fhirEncounter.period.start),
      endDate: fhirEncounter.period.end ? new Date(fhirEncounter.period.end) : null,
      encounterType: fhirEncounter.class?.code || 'GENERAL',
      patientId: fhirEncounter.subject.reference.split('/')[1],
      providerId: fhirEncounter.participant?.[0]?.individual.reference.split('/')[1],
      locationId: fhirEncounter.location?.[0]?.location.reference.split('/')[1],
      notes: fhirEncounter.reasonCode?.[0]?.text
    };
  }

  // Transform internal observation to FHIR Observation
  observationToFhir(observation: any): any {
    return {
      resourceType: 'Observation',
      id: observation.id,
      status: 'final',
      code: {
        coding: [{
          code: observation.concept.name,
          display: observation.concept.description
        }]
      },
      subject: { reference: `Patient/${observation.patientId}` },
      encounter: observation.encounterId ? { reference: `Encounter/${observation.encounterId}` } : undefined,
      effectiveDateTime: observation.obsDatetime.toISOString(),
      valueQuantity: observation.valueNumeric ? {
        value: observation.valueNumeric,
        unit: observation.concept.units
      } : undefined,
      valueString: observation.valueText,
      valueCoding: observation.valueCoded ? {
        code: observation.valueCoded,
        display: observation.valueCodedName
      } : undefined
    };
  }

  // Transform internal appointment to FHIR Appointment
  appointmentToFhir(appointment: any): any {
    return {
      resourceType: 'Appointment',
      id: appointment.id,
      status: appointment.status || 'booked',
      serviceType: [{
        text: appointment.reason || 'General consultation'
      }],
      start: new Date(`${appointment.appointmentDate.toISOString().split('T')[0]}T${appointment.appointmentTime}`).toISOString(),
      participant: [
        {
          actor: { reference: `Patient/${appointment.patientId}` },
          status: 'accepted'
        },
        {
          actor: { reference: `Practitioner/${appointment.providerId}` },
          status: 'accepted'
        }
      ],
      location: appointment.locationId ? { reference: `Location/${appointment.locationId}` } : undefined
    };
  }

  // Transform FHIR Appointment to internal format
  fhirToAppointment(fhirAppointment: any): any {
    const startDate = new Date(fhirAppointment.start);
    return {
      appointmentDate: startDate,
      appointmentTime: startDate.toTimeString().slice(0, 5),
      status: fhirAppointment.status,
      reason: fhirAppointment.serviceType?.[0]?.text,
      patientId: fhirAppointment.participant?.find(p => p.actor.reference.startsWith('Patient/'))?.actor.reference.split('/')[1],
      providerId: fhirAppointment.participant?.find(p => p.actor.reference.startsWith('Practitioner/'))?.actor.reference.split('/')[1],
      locationId: fhirAppointment.location?.reference?.split('/')[1]
    };
  }

  // Transform internal visit to FHIR Encounter (visits are encounters in FHIR)
  visitToFhir(visit: any): any {
    return {
      resourceType: 'Encounter',
      id: visit.id,
      status: visit.stopDatetime ? 'finished' : 'in-progress',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: visit.visitType?.toLowerCase() || 'AMB',
        display: visit.visitType || 'Ambulatory'
      },
      subject: { reference: `Patient/${visit.patientId}` },
      period: {
        start: visit.startDatetime.toISOString(),
        end: visit.stopDatetime?.toISOString()
      },
      location: visit.locationId ? [{
        location: { reference: `Location/${visit.locationId}` }
      }] : undefined,
      serviceProvider: visit.locationId ? { reference: `Organization/${visit.locationId}` } : undefined
    };
  }

  // Transform FHIR Encounter to internal visit format
  fhirToVisit(fhirEncounter: any): any {
    return {
      startDatetime: new Date(fhirEncounter.period.start),
      stopDatetime: fhirEncounter.period.end ? new Date(fhirEncounter.period.end) : null,
      visitType: fhirEncounter.class?.display || 'Ambulatory',
      patientId: fhirEncounter.subject.reference.split('/')[1],
      locationId: fhirEncounter.location?.[0]?.location.reference.split('/')[1]
    };
  }
}