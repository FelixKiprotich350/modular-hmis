-- Healthcare Service Categories Seed Data
INSERT INTO "ServiceCategory" (id, name, code, description, active, "createdAt", "updatedAt") VALUES
('cat_001', 'Consultation', 'CONSULTATION', 'Medical consultation services', true, NOW(), NOW()),
('cat_002', 'Laboratory', 'LABORATORY', 'Laboratory and diagnostic tests', true, NOW(), NOW()),
('cat_003', 'Radiology', 'RADIOLOGY', 'Imaging and radiology services', true, NOW(), NOW()),
('cat_004', 'Pharmacy', 'PHARMACY', 'Medication and pharmaceutical services', true, NOW(), NOW()),
('cat_005', 'Nursing', 'NURSING', 'Nursing care services', true, NOW(), NOW()),
('cat_006', 'Emergency', 'EMERGENCY', 'Emergency medical services', true, NOW(), NOW()),
('cat_007', 'Preventive', 'PREVENTIVE', 'Preventive healthcare services', true, NOW(), NOW()),
('cat_008', 'Maternity', 'MATERNITY', 'Maternal and child health services', true, NOW(), NOW()),
('cat_009', 'Dental', 'DENTAL', 'Dental care services', true, NOW(), NOW());

-- Healthcare Services Seed Data
INSERT INTO "Service" (id, name, code, description, "categoryId", duration, price, active, "createdAt", "updatedAt") VALUES
-- Consultation Services
('srv_001', 'General Consultation', 'GEN_CONSULT', 'General medical consultation', 'cat_001', 30, 50.00, true, NOW(), NOW()),
('srv_002', 'Specialist Consultation', 'SPEC_CONSULT', 'Specialist medical consultation', 'cat_001', 45, 100.00, true, NOW(), NOW()),
('srv_003', 'Emergency Consultation', 'EMERG_CONSULT', 'Emergency medical consultation', 'cat_006', 60, 150.00, true, NOW(), NOW()),
('srv_004', 'Follow-up Consultation', 'FOLLOWUP_CONSULT', 'Follow-up medical consultation', 'cat_001', 20, 30.00, true, NOW(), NOW()),

-- Laboratory Services
('srv_005', 'Complete Blood Count', 'CBC', 'Full blood count analysis', 'cat_002', 15, 25.00, true, NOW(), NOW()),
('srv_006', 'Blood Sugar Test', 'BST', 'Blood glucose level test', 'cat_002', 10, 15.00, true, NOW(), NOW()),
('srv_007', 'Lipid Profile', 'LIPID_PROF', 'Cholesterol and lipid analysis', 'cat_002', 20, 35.00, true, NOW(), NOW()),
('srv_008', 'Liver Function Test', 'LFT', 'Liver enzyme analysis', 'cat_002', 25, 40.00, true, NOW(), NOW()),
('srv_009', 'Kidney Function Test', 'KFT', 'Kidney function analysis', 'cat_002', 25, 40.00, true, NOW(), NOW()),
('srv_010', 'Urine Analysis', 'URINE_ANAL', 'Complete urine examination', 'cat_002', 15, 20.00, true, NOW(), NOW()),

-- Radiology Services
('srv_011', 'Chest X-Ray', 'CHEST_XRAY', 'Chest radiography', 'cat_003', 15, 60.00, true, NOW(), NOW()),
('srv_012', 'Abdominal Ultrasound', 'ABD_US', 'Abdominal ultrasound scan', 'cat_003', 30, 80.00, true, NOW(), NOW()),
('srv_013', 'CT Scan Head', 'CT_HEAD', 'Computed tomography of head', 'cat_003', 45, 200.00, true, NOW(), NOW()),
('srv_014', 'MRI Brain', 'MRI_BRAIN', 'Magnetic resonance imaging of brain', 'cat_003', 60, 400.00, true, NOW(), NOW()),
('srv_015', 'Mammography', 'MAMMO', 'Breast imaging examination', 'cat_003', 20, 120.00, true, NOW(), NOW()),

-- Pharmacy Services
('srv_016', 'Prescription Dispensing', 'PRESC_DISP', 'Medication dispensing service', 'cat_004', 10, 5.00, true, NOW(), NOW()),
('srv_017', 'Medication Counseling', 'MED_COUNSEL', 'Pharmacist consultation', 'cat_004', 15, 20.00, true, NOW(), NOW()),
('srv_018', 'Drug Information', 'DRUG_INFO', 'Drug information service', 'cat_004', 10, 10.00, true, NOW(), NOW()),

-- Nursing Services
('srv_019', 'Vital Signs Check', 'VITALS', 'Blood pressure, temperature, pulse check', 'cat_005', 10, 15.00, true, NOW(), NOW()),
('srv_020', 'Injection Administration', 'INJECTION', 'Intramuscular/intravenous injection', 'cat_005', 5, 10.00, true, NOW(), NOW()),
('srv_021', 'Wound Dressing', 'WOUND_DRESS', 'Wound cleaning and dressing', 'cat_005', 20, 25.00, true, NOW(), NOW()),
('srv_022', 'IV Therapy', 'IV_THERAPY', 'Intravenous fluid therapy', 'cat_005', 60, 50.00, true, NOW(), NOW()),

-- Preventive Services
('srv_023', 'Health Screening', 'HEALTH_SCREEN', 'General health screening', 'cat_007', 45, 75.00, true, NOW(), NOW()),
('srv_024', 'Vaccination', 'VACCINATION', 'Immunization service', 'cat_007', 15, 30.00, true, NOW(), NOW()),
('srv_025', 'Health Education', 'HEALTH_EDUC', 'Patient health education', 'cat_007', 30, 25.00, true, NOW(), NOW()),

-- Maternity Services
('srv_026', 'Antenatal Care', 'ANC', 'Prenatal care consultation', 'cat_008', 30, 60.00, true, NOW(), NOW()),
('srv_027', 'Delivery Service', 'DELIVERY', 'Normal delivery service', 'cat_008', 240, 500.00, true, NOW(), NOW()),
('srv_028', 'Postnatal Care', 'PNC', 'Postpartum care', 'cat_008', 30, 50.00, true, NOW(), NOW()),

-- Dental Services
('srv_029', 'Dental Consultation', 'DENTAL_CONSULT', 'Dental examination', 'cat_009', 30, 40.00, true, NOW(), NOW()),
('srv_030', 'Tooth Extraction', 'TOOTH_EXTRACT', 'Simple tooth extraction', 'cat_009', 45, 80.00, true, NOW(), NOW()),
('srv_031', 'Dental Cleaning', 'DENTAL_CLEAN', 'Professional teeth cleaning', 'cat_009', 60, 60.00, true, NOW(), NOW());