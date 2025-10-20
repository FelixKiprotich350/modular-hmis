export class PatientFhirMapper {
  static toFhir(patient: any): any {
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

  static fromFhir(fhirPatient: any): any {
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
}