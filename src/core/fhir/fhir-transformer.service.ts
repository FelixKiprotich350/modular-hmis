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
}