import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default privileges
  const privileges = [
    'manage_users',
    'manage_roles',
    'view_patients',
    'create_patients',
    'edit_patients',
    'delete_patients',
    'view_encounters',
    'create_encounters',
    'edit_encounters',
    'view_appointments',
    'create_appointments',
    'edit_appointments',
    'manage_concepts',
    'view_lab_results',
    'create_lab_orders',
    'manage_locations',
    'view_observations',
    'create_observations',
    'manage_providers',
    'view_radiology',
    'create_radiology_orders',
    'manage_settings',
    'view_visits',
    'create_visits',
    'manage_billing',
    'view_billing',
    'manage_insurance',
    'view_insurance',
    'manage_inventory',
    'view_inventory',
    'manage_mobile_clinic',
    'view_mobile_clinic',
    'manage_pharmacy',
    'view_pharmacy',
    'view_reports',
    'generate_reports',
    'manage_telemedicine',
    'view_telemedicine'
  ];

  for (const privilegeName of privileges) {
    await prisma.privilege.upsert({
      where: { name: privilegeName },
      update: {},
      create: { name: privilegeName }
    });
  }

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' }
  });

  const doctorRole = await prisma.role.upsert({
    where: { name: 'doctor' },
    update: {},
    create: { name: 'doctor' }
  });

  const nurseRole = await prisma.role.upsert({
    where: { name: 'nurse' },
    update: {},
    create: { name: 'nurse' }
  });

  // Assign privileges to admin role (all privileges)
  const allPrivileges = await prisma.privilege.findMany();
  for (const privilege of allPrivileges) {
    await prisma.rolePrivilege.upsert({
      where: {
        roleId_privilegeId: {
          roleId: adminRole.id,
          privilegeId: privilege.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        privilegeId: privilege.id
      }
    });
  }

  // Assign privileges to doctor role
  const doctorPrivileges = [
    'view_patients', 'create_patients', 'edit_patients', 
    'view_encounters', 'create_encounters', 'edit_encounters',
    'view_appointments', 'create_appointments', 'edit_appointments',
    'view_lab_results', 'create_lab_orders',
    'view_observations', 'create_observations',
    'view_radiology', 'create_radiology_orders',
    'view_visits', 'create_visits',
    'manage_billing', 'view_billing',
    'manage_pharmacy', 'view_pharmacy',
    'view_reports'
  ];
  for (const privilegeName of doctorPrivileges) {
    const privilege = await prisma.privilege.findUnique({ where: { name: privilegeName } });
    if (privilege) {
      await prisma.rolePrivilege.upsert({
        where: {
          roleId_privilegeId: {
            roleId: doctorRole.id,
            privilegeId: privilege.id
          }
        },
        update: {},
        create: {
          roleId: doctorRole.id,
          privilegeId: privilege.id
        }
      });
    }
  }

  // Assign privileges to nurse role
  const nursePrivileges = [
    'view_patients', 'view_encounters', 
    'view_appointments', 'create_appointments', 'edit_appointments',
    'view_observations', 'create_observations',
    'view_visits',
    'view_billing',
    'view_inventory',
    'view_pharmacy'
  ];
  for (const privilegeName of nursePrivileges) {
    const privilege = await prisma.privilege.findUnique({ where: { name: privilegeName } });
    if (privilege) {
      await prisma.rolePrivilege.upsert({
        where: {
          roleId_privilegeId: {
            roleId: nurseRole.id,
            privilegeId: privilege.id
          }
        },
        update: {},
        create: {
          roleId: nurseRole.id,
          privilegeId: privilege.id
        }
      });
    }
  }

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@hospital.com',
      password: hashedPassword
    }
  });

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id
    }
  });

  // Create identifier types
  const nationalIdType = await prisma.identifierType.upsert({
    where: { name: 'National ID' },
    update: {},
    create: {
      name: 'National ID',
      description: 'National identification number',
      required: true
    }
  });

  const medicalRecordType = await prisma.identifierType.upsert({
    where: { name: 'Medical Record Number' },
    update: {},
    create: {
      name: 'Medical Record Number',
      description: 'Hospital medical record number',
      required: false
    }
  });

  // Create relationship types
  const relationshipTypes = [
    { aIsToB: 'Parent', bIsToA: 'Child' },
    { aIsToB: 'Spouse', bIsToA: 'Spouse' },
    { aIsToB: 'Sibling', bIsToA: 'Sibling' },
    { aIsToB: 'Guardian', bIsToA: 'Ward' },
    { aIsToB: 'Emergency Contact', bIsToA: 'Patient' }
  ];

  for (const relType of relationshipTypes) {
    const existing = await prisma.relationshipType.findFirst({
      where: { aIsToB: relType.aIsToB }
    });
    
    if (!existing) {
      await prisma.relationshipType.create({
        data: relType
      });
    }
  }

  // Create person attribute types
  const attributeTypes = [
    { name: 'Occupation', format: 'text' },
    { name: 'Education Level', format: 'text' },
    { name: 'Marital Status', format: 'coded' },
    { name: 'Religion', format: 'text' },
    { name: 'Nationality', format: 'text' },
    { name: 'Emergency Contact Name', format: 'text' },
    { name: 'Emergency Contact Phone', format: 'text' }
  ];

  for (const attrType of attributeTypes) {
    await prisma.personAttributeType.upsert({
      where: { name: attrType.name },
      update: {},
      create: attrType
    });
  }

  // Create sample patients with comprehensive data
  const samplePatients = [
    {
      person: {
        firstName: 'John',
        lastName: 'Doe',
        sex: 'M',
        gender: 'Man',
        birthdate: new Date('1985-03-15')
      },
      identifiers: [{ type: nationalIdType.id, value: 'ID123456789', preferred: true }],
      contacts: [
        { type: 'phone', value: '+1234567890', preferred: true },
        { type: 'email', value: 'john.doe@email.com', preferred: false }
      ],
      addresses: [{
        address1: '123 Main St',
        cityVillage: 'Springfield',
        stateProvince: 'IL',
        country: 'USA',
        postalCode: '62701',
        preferred: true
      }]
    },
    {
      person: {
        firstName: 'Jane',
        lastName: 'Smith',
        sex: 'F',
        gender: 'Woman',
        birthdate: new Date('1990-07-22')
      },
      identifiers: [{ type: nationalIdType.id, value: 'ID987654321', preferred: true }],
      contacts: [
        { type: 'phone', value: '+1987654321', preferred: true }
      ],
      addresses: [{
        address1: '456 Oak Ave',
        cityVillage: 'Madison',
        stateProvince: 'WI',
        country: 'USA',
        postalCode: '53703',
        preferred: true
      }]
    }
  ];

  for (const patientData of samplePatients) {
    const person = await prisma.person.create({
      data: patientData.person
    });

    const patient = await prisma.patient.create({
      data: { personId: person.id }
    });

    // Create identifiers
    for (const identifier of patientData.identifiers) {
      await prisma.patientIdentifier.create({
        data: {
          patientId: patient.id,
          identifierTypeId: identifier.type,
          identifier: identifier.value,
          preferred: identifier.preferred
        }
      });
    }

    // Create contacts
    if (patientData.contacts) {
      for (const contact of patientData.contacts) {
        await prisma.personContact.create({
          data: {
            personId: person.id,
            type: contact.type,
            value: contact.value,
            preferred: contact.preferred
          }
        });
      }
    }

    // Create addresses
    if (patientData.addresses) {
      for (const address of patientData.addresses) {
        await prisma.personAddress.create({
          data: {
            personId: person.id,
            preferred: address.preferred,
            address1: address.address1,
            cityVillage: address.cityVillage,
            stateProvince: address.stateProvince,
            country: address.country,
            postalCode: address.postalCode
          }
        });
      }
    }
  }

  console.log('Database seeded successfully with comprehensive patient data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });