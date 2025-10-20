export class VisitFhirMapper {
  static toFhir(visit: any): any {
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

  static fromFhir(fhirEncounter: any): any {
    return {
      startDatetime: new Date(fhirEncounter.period.start),
      stopDatetime: fhirEncounter.period.end ? new Date(fhirEncounter.period.end) : null,
      visitType: fhirEncounter.class?.display || 'Ambulatory',
      patientId: fhirEncounter.subject.reference.split('/')[1],
      locationId: fhirEncounter.location?.[0]?.location.reference.split('/')[1]
    };
  }
}