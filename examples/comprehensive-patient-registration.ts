import { RegisterPatientDto } from '../src/modules/core/patients/dto/register-patient.dto';

/**
 * Example of comprehensive patient registration capturing all required data categories:
 * - Basic Info (including identifiers)
 * - Contact Details
 * - Demographics (addresses)
 * - Death Info
 * - Relationships
 * - Next of Kin
 */

export const comprehensivePatientExample: RegisterPatientDto = {
  // Basic Info
  firstName: 'Sarah',
  lastName: 'Johnson',
  middleName: 'Marie',
  gender: 'F',
  birthdate: new Date('1985-06-15'),
  birthdateEstimated: false,

  // Identifiers (part of basic info)
  identifiers: [
    {
      identifierTypeId: 'national-id-type-uuid',
      identifier: 'ID123456789',
      preferred: true
    },
    {
      identifierTypeId: 'medical-record-type-uuid',
      preferred: false
    }
  ],

  // Contact Details
  contacts: [
    {
      type: 'phone',
      value: '+1-555-0123',
      preferred: true
    },
    {
      type: 'email',
      value: 'sarah.johnson@email.com',
      preferred: false
    }
  ],

  // Demographics (addresses)
  addresses: [
    {
      address1: '123 Main Street',
      address2: 'Apt 4B',
      cityVillage: 'Springfield',
      stateProvince: 'Illinois',
      country: 'United States',
      postalCode: '62701',
      preferred: true
    }
  ],

  // Death Info (if applicable)
  dead: false,

  // Additional attributes
  attributes: [
    {
      attributeTypeId: 'occupation-attr-type-uuid',
      value: 'Software Engineer'
    },
    {
      attributeTypeId: 'marital-status-attr-type-uuid',
      value: 'Married'
    }
  ],

  // Relationships
  relationships: [
    {
      personB: {
        firstName: 'Michael',
        lastName: 'Johnson',
        gender: 'M',
        birthdate: new Date('1983-03-10')
      },
      relationshipTypeId: 'spouse-relationship-type-uuid',
      startDate: new Date('2010-08-20')
    }
  ],

  // Next of Kin
  nextOfKin: [
    {
      firstName: 'Michael',
      lastName: 'Johnson',
      relationship: 'Spouse',
      priority: 1,
      contactPhone: '+1-555-0125',
      contactEmail: 'michael.johnson@email.com'
    }
  ]
};