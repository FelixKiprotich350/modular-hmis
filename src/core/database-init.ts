import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function initializeDatabase() {
  try {
    // Create default identifier types
    await prisma.identifierType.upsert({
      where: { name: 'Patient ID' },
      update: {},
      create: {
        name: 'Patient ID',
        description: 'Primary patient identifier',
        format: 'P######',
        required: true,
        checkDigit: false,
        retired: false
      }
    });

    // Create basic concepts
    const concepts = [
      { name: 'Temperature', datatype: 'Numeric', conceptClass: 'Test', units: '°C' },
      { name: 'Blood Pressure Systolic', datatype: 'Numeric', conceptClass: 'Test', units: 'mmHg' },
      { name: 'Blood Pressure Diastolic', datatype: 'Numeric', conceptClass: 'Test', units: 'mmHg' },
      { name: 'Weight', datatype: 'Numeric', conceptClass: 'Test', units: 'kg' },
      { name: 'Height', datatype: 'Numeric', conceptClass: 'Test', units: 'cm' },
      { name: 'HIV Status', datatype: 'Coded', conceptClass: 'Question' },
      { name: 'Positive', datatype: 'Text', conceptClass: 'Answer' },
      { name: 'Negative', datatype: 'Text', conceptClass: 'Answer' },
      { name: 'Unknown', datatype: 'Text', conceptClass: 'Answer' }
    ];

    for (const concept of concepts) {
      await prisma.concept.upsert({
        where: { name: concept.name },
        update: {},
        create: {
          ...concept,
          retired: false
        }
      });
    }

    // Create default location
    await prisma.location.upsert({
      where: { name: 'Main Hospital' },
      update: {},
      create: {
        name: 'Main Hospital',
        description: 'Main hospital facility',
        address: '123 Health Street',
        cityVillage: 'Health City',
        stateProvince: 'Health State',
        country: 'Health Country',
        retired: false
      }
    });

    // Create default programs
    const programs = [
      { name: 'HIV Program', description: 'HIV care and treatment program' },
      { name: 'TB Program', description: 'Tuberculosis treatment program' },
      { name: 'ANC Program', description: 'Antenatal care program' }
    ];

    for (const program of programs) {
      await prisma.program.upsert({
        where: { name: program.name },
        update: {},
        create: {
          ...program,
          retired: false
        }
      });
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function seedTestData() {
  try {
    // Create a test person and patient
    const identifierType = await prisma.identifierType.findFirst({
      where: { name: 'Patient ID' }
    });

    if (!identifierType) {
      throw new Error('Patient ID identifier type not found');
    }

    const person = await prisma.person.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Test',
        gender: 'M',
        birthdate: new Date('1990-01-01'),
        birthdateEstimated: false,
        dead: false
      }
    });

    const patient = await prisma.patient.create({
      data: {
        personId: person.id,
        identifiers: {
          create: {
            identifierTypeId: identifierType.id,
            identifier: 'P000001',
            preferred: true
          }
        }
      }
    });

    console.log('Test data seeded successfully');
    return { person, patient };
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
}