CREATE TABLE IF NOT EXISTS radiology_studies (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  modality VARCHAR(50),
  body_part VARCHAR(255),
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  retired BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS radiology_orders (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(255) NOT NULL,
  encounter_id VARCHAR(255),
  study_id VARCHAR(255) NOT NULL,
  urgency VARCHAR(50) DEFAULT 'ROUTINE',
  clinical_history TEXT,
  instructions TEXT,
  orderer VARCHAR(255),
  date_ordered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'NEW'
);

CREATE TABLE IF NOT EXISTS radiology_reports (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(255) NOT NULL,
  study_id VARCHAR(255) NOT NULL,
  report_body TEXT,
  impression TEXT,
  radiologist VARCHAR(255),
  report_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'DRAFT',
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES radiology_orders(id)
);

CREATE INDEX IF NOT EXISTS idx_rad_orders_patient ON radiology_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_rad_reports_order ON radiology_reports(order_id);