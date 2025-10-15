CREATE TABLE IF NOT EXISTS insurance_providers (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  contact_person VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patient_insurance (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(255) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  policy_number VARCHAR(255) NOT NULL,
  group_number VARCHAR(255),
  coverage_start DATE,
  coverage_end DATE,
  copay_amount DECIMAL(10,2),
  deductible_amount DECIMAL(10,2),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES insurance_providers(id)
);

CREATE TABLE IF NOT EXISTS insurance_claims (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_insurance_id VARCHAR(255) NOT NULL,
  encounter_id VARCHAR(255),
  claim_number VARCHAR(255) UNIQUE,
  claim_amount DECIMAL(10,2) NOT NULL,
  approved_amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'SUBMITTED',
  submission_date DATE,
  response_date DATE,
  denial_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_insurance_id) REFERENCES patient_insurance(id)
);

CREATE INDEX IF NOT EXISTS idx_patient_insurance_patient ON patient_insurance(patient_id);
CREATE INDEX IF NOT EXISTS idx_claims_insurance ON insurance_claims(patient_insurance_id);