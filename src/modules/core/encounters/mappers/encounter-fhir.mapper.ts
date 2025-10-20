export class EncounterFhirMapper {
  static toFhir(encounter: any): any {
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

  static fromFhir(fhirEncounter: any): any {
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
}