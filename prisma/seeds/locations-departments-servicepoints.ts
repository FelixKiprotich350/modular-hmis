import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedLocationsAndDepartments() {
  // Create facilities
  const mainHospital = await prisma.facility.create({
    data: {
      name: 'Main Hospital',
      description: 'Primary healthcare facility',
      address: '123 Healthcare Ave',
      cityVillage: 'Medical City',
      stateProvince: 'Health State',
      country: 'Healthcare Country',
      postalCode: '12345',
      phone: '+1-555-0100'
    }
  });

  const outpatientClinic = await prisma.facility.create({
    data: {
      name: 'Outpatient Clinic',
      description: 'Outpatient services facility',
      address: '456 Clinic St',
      cityVillage: 'Medical City',
      stateProvince: 'Health State',
      country: 'Healthcare Country',
      postalCode: '12346',
      phone: '+1-555-0200'
    }
  });

  // Create departments
  const departments = [
    { facilityId: mainHospital.id, name: 'Emergency Department', description: 'Emergency medical services' },
    { facilityId: mainHospital.id, name: 'Internal Medicine', description: 'Internal medicine department' },
    { facilityId: mainHospital.id, name: 'Surgery', description: 'Surgical services' },
    { facilityId: mainHospital.id, name: 'Pediatrics', description: 'Child healthcare services' },
    { facilityId: mainHospital.id, name: 'Obstetrics & Gynecology', description: 'Maternal and womens health' },
    { facilityId: outpatientClinic.id, name: 'General Practice', description: 'General outpatient services' },
    { facilityId: outpatientClinic.id, name: 'Specialist Clinics', description: 'Specialist consultation services' }
  ];

  const createdDepartments = [];
  for (const dept of departments) {
    const department = await prisma.department.create({
      data: dept
    });
    createdDepartments.push(department);
  }

  // Create locations
  const locations = [
    { facilityId: mainHospital.id, name: 'Ground Floor', description: 'Main entrance and reception', locationLevel: 'floor' },
    { facilityId: mainHospital.id, name: 'First Floor', description: 'Outpatient departments', locationLevel: 'floor' },
    { facilityId: mainHospital.id, name: 'Second Floor', description: 'Inpatient wards', locationLevel: 'floor' },
    { facilityId: outpatientClinic.id, name: 'Main Building', description: 'Primary clinic building', locationLevel: 'building' }
  ];

  const createdLocations = [];
  for (const loc of locations) {
    const location = await prisma.location.create({
      data: loc
    });
    createdLocations.push(location);
  }

  // Create service points
  const servicePoints = [
    { locationId: createdLocations[0].id, name: 'Reception Desk', description: 'Main reception and registration', serviceType: 'registration' },
    { locationId: createdLocations[0].id, name: 'Triage Station', description: 'Patient triage and assessment', serviceType: 'triage' },
    { locationId: createdLocations[0].id, name: 'Emergency Room', description: 'Emergency medical care', serviceType: 'emergency' },
    { locationId: createdLocations[1].id, name: 'Consultation Room 1', description: 'General consultation room', serviceType: 'consultation' },
    { locationId: createdLocations[1].id, name: 'Consultation Room 2', description: 'Specialist consultation room', serviceType: 'consultation' },
    { locationId: createdLocations[1].id, name: 'Laboratory', description: 'Diagnostic laboratory services', serviceType: 'laboratory' },
    { locationId: createdLocations[1].id, name: 'Radiology Department', description: 'Imaging and radiology services', serviceType: 'radiology' },
    { locationId: createdLocations[1].id, name: 'Pharmacy', description: 'Medication dispensing', serviceType: 'pharmacy' },
    { locationId: createdLocations[2].id, name: 'Ward A', description: 'General medical ward', serviceType: 'inpatient' },
    { locationId: createdLocations[2].id, name: 'Ward B', description: 'Surgical ward', serviceType: 'inpatient' },
    { locationId: createdLocations[3].id, name: 'Clinic Room 1', description: 'Outpatient consultation', serviceType: 'consultation' },
    { locationId: createdLocations[3].id, name: 'Clinic Room 2', description: 'Specialist consultation', serviceType: 'consultation' }
  ];

  for (const sp of servicePoints) {
    await prisma.servicePoint.create({
      data: sp
    });
  }

  console.log('Locations, departments, and service points seeded successfully');
}

if (require.main === module) {
  seedLocationsAndDepartments()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}