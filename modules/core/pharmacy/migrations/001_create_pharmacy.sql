CREATE TABLE IF NOT EXISTS drugs (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  combination BOOLEAN DEFAULT FALSE,
  dosage_form VARCHAR(255),
  strength VARCHAR(255),
  maximum_daily_dose DECIMAL(10,2),
  minimum_daily_dose DECIMAL(10,2),
  route VARCHAR(255),
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  retired BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS drug_orders (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(255) NOT NULL,
  encounter_id VARCHAR(255),
  drug_id VARCHAR(255) NOT NULL,
  dose DECIMAL(10,2),
  dose_units VARCHAR(255),
  frequency VARCHAR(255),
  quantity DECIMAL(10,2),
  units VARCHAR(255),
  instructions TEXT,
  start_date DATE,
  auto_expire_date DATE,
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  discontinued BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_drugs_concept ON drugs(concept_id);
CREATE INDEX IF NOT EXISTS idx_drug_orders_patient ON drug_orders(patient_id);