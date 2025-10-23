import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedServicesAndCategories() {
  // Create service categories
  const categories = [
    { name: 'Consultation', code: 'CONSULTATION', description: 'Medical consultation services' },
    { name: 'Laboratory', code: 'LABORATORY', description: 'Laboratory and diagnostic tests' },
    { name: 'Radiology', code: 'RADIOLOGY', description: 'Imaging and radiology services' },
    { name: 'Pharmacy', code: 'PHARMACY', description: 'Medication and pharmaceutical services' },
    { name: 'Nursing', code: 'NURSING', description: 'Nursing care services' },
    { name: 'Emergency', code: 'EMERGENCY', description: 'Emergency medical services' },
    { name: 'Preventive', code: 'PREVENTIVE', description: 'Preventive healthcare services' },
    { name: 'Maternity', code: 'MATERNITY', description: 'Maternal and child health services' },
    { name: 'Dental', code: 'DENTAL', description: 'Dental care services' }
  ];

  const createdCategories = new Map();
  for (const categoryData of categories) {
    const category = await prisma.serviceCategory.upsert({
      where: { code: categoryData.code },
      update: {},
      create: categoryData
    });
    createdCategories.set(categoryData.code, category.id);
  }

  // Create services
  const services = [
    // Consultation Services
    { name: 'General Consultation', code: 'GEN_CONSULT', description: 'General medical consultation', categoryId: createdCategories.get('CONSULTATION'), duration: 30, price: 50.00 },
    { name: 'Specialist Consultation', code: 'SPEC_CONSULT', description: 'Specialist medical consultation', categoryId: createdCategories.get('CONSULTATION'), duration: 45, price: 100.00 },
    { name: 'Follow-up Consultation', code: 'FOLLOWUP_CONSULT', description: 'Follow-up medical consultation', categoryId: createdCategories.get('CONSULTATION'), duration: 20, price: 30.00 },

    // Emergency Services
    { name: 'Emergency Consultation', code: 'EMERG_CONSULT', description: 'Emergency medical consultation', categoryId: createdCategories.get('EMERGENCY'), duration: 60, price: 150.00 },

    // Laboratory Services
    { name: 'Complete Blood Count', code: 'CBC', description: 'Full blood count analysis', categoryId: createdCategories.get('LABORATORY'), duration: 15, price: 25.00 },
    { name: 'Blood Sugar Test', code: 'BST', description: 'Blood glucose level test', categoryId: createdCategories.get('LABORATORY'), duration: 10, price: 15.00 },
    { name: 'Lipid Profile', code: 'LIPID_PROF', description: 'Cholesterol and lipid analysis', categoryId: createdCategories.get('LABORATORY'), duration: 20, price: 35.00 },
    { name: 'Liver Function Test', code: 'LFT', description: 'Liver enzyme analysis', categoryId: createdCategories.get('LABORATORY'), duration: 25, price: 40.00 },
    { name: 'Kidney Function Test', code: 'KFT', description: 'Kidney function analysis', categoryId: createdCategories.get('LABORATORY'), duration: 25, price: 40.00 },
    { name: 'Urine Analysis', code: 'URINE_ANAL', description: 'Complete urine examination', categoryId: createdCategories.get('LABORATORY'), duration: 15, price: 20.00 },

    // Radiology Services
    { name: 'Chest X-Ray', code: 'CHEST_XRAY', description: 'Chest radiography', categoryId: createdCategories.get('RADIOLOGY'), duration: 15, price: 60.00 },
    { name: 'Abdominal Ultrasound', code: 'ABD_US', description: 'Abdominal ultrasound scan', categoryId: createdCategories.get('RADIOLOGY'), duration: 30, price: 80.00 },
    { name: 'CT Scan Head', code: 'CT_HEAD', description: 'Computed tomography of head', categoryId: createdCategories.get('RADIOLOGY'), duration: 45, price: 200.00 },
    { name: 'MRI Brain', code: 'MRI_BRAIN', description: 'Magnetic resonance imaging of brain', categoryId: createdCategories.get('RADIOLOGY'), duration: 60, price: 400.00 },
    { name: 'Mammography', code: 'MAMMO', description: 'Breast imaging examination', categoryId: createdCategories.get('RADIOLOGY'), duration: 20, price: 120.00 },

    // Pharmacy Services
    { name: 'Prescription Dispensing', code: 'PRESC_DISP', description: 'Medication dispensing service', categoryId: createdCategories.get('PHARMACY'), duration: 10, price: 5.00 },
    { name: 'Medication Counseling', code: 'MED_COUNSEL', description: 'Pharmacist consultation', categoryId: createdCategories.get('PHARMACY'), duration: 15, price: 20.00 },
    { name: 'Drug Information', code: 'DRUG_INFO', description: 'Drug information service', categoryId: createdCategories.get('PHARMACY'), duration: 10, price: 10.00 },

    // Nursing Services
    { name: 'Vital Signs Check', code: 'VITALS', description: 'Blood pressure, temperature, pulse check', categoryId: createdCategories.get('NURSING'), duration: 10, price: 15.00 },
    { name: 'Injection Administration', code: 'INJECTION', description: 'Intramuscular/intravenous injection', categoryId: createdCategories.get('NURSING'), duration: 5, price: 10.00 },
    { name: 'Wound Dressing', code: 'WOUND_DRESS', description: 'Wound cleaning and dressing', categoryId: createdCategories.get('NURSING'), duration: 20, price: 25.00 },
    { name: 'IV Therapy', code: 'IV_THERAPY', description: 'Intravenous fluid therapy', categoryId: createdCategories.get('NURSING'), duration: 60, price: 50.00 },

    // Preventive Services
    { name: 'Health Screening', code: 'HEALTH_SCREEN', description: 'General health screening', categoryId: createdCategories.get('PREVENTIVE'), duration: 45, price: 75.00 },
    { name: 'Vaccination', code: 'VACCINATION', description: 'Immunization service', categoryId: createdCategories.get('PREVENTIVE'), duration: 15, price: 30.00 },
    { name: 'Health Education', code: 'HEALTH_EDUC', description: 'Patient health education', categoryId: createdCategories.get('PREVENTIVE'), duration: 30, price: 25.00 },

    // Maternity Services
    { name: 'Antenatal Care', code: 'ANC', description: 'Prenatal care consultation', categoryId: createdCategories.get('MATERNITY'), duration: 30, price: 60.00 },
    { name: 'Delivery Service', code: 'DELIVERY', description: 'Normal delivery service', categoryId: createdCategories.get('MATERNITY'), duration: 240, price: 500.00 },
    { name: 'Postnatal Care', code: 'PNC', description: 'Postpartum care', categoryId: createdCategories.get('MATERNITY'), duration: 30, price: 50.00 },

    // Dental Services
    { name: 'Dental Consultation', code: 'DENTAL_CONSULT', description: 'Dental examination', categoryId: createdCategories.get('DENTAL'), duration: 30, price: 40.00 },
    { name: 'Tooth Extraction', code: 'TOOTH_EXTRACT', description: 'Simple tooth extraction', categoryId: createdCategories.get('DENTAL'), duration: 45, price: 80.00 },
    { name: 'Dental Cleaning', code: 'DENTAL_CLEAN', description: 'Professional teeth cleaning', categoryId: createdCategories.get('DENTAL'), duration: 60, price: 60.00 }
  ];

  for (const serviceData of services) {
    await prisma.service.upsert({
      where: { code: serviceData.code },
      update: {},
      create: serviceData
    });
  }

  console.log('Service categories and services seeded successfully');
}

if (require.main === module) {
  seedServicesAndCategories()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}