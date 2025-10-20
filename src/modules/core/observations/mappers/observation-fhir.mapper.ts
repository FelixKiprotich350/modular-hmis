export class ObservationFhirMapper {
  static toFhir(observation: any): any {
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

  static fromFhir(fhirObservation: any): any {
    return {
      obsDatetime: new Date(fhirObservation.effectiveDateTime),
      valueNumeric: fhirObservation.valueQuantity?.value,
      valueText: fhirObservation.valueString,
      valueCoded: fhirObservation.valueCoding?.code,
      valueCodedName: fhirObservation.valueCoding?.display,
      patientId: fhirObservation.subject.reference.split('/')[1],
      encounterId: fhirObservation.encounter?.reference.split('/')[1],
      conceptId: fhirObservation.code.coding[0].code
    };
  }
}