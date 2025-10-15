CREATE TABLE IF NOT EXISTS encounters (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(255) NOT NULL,
  provider_id VARCHAR(255),
  location_id VARCHAR(255),
  encounter_type VARCHAR(100) NOT NULL,
  encounter_datetime TIMESTAMP NOT NULL,
  form_id VARCHAR(255),
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  voided BOOLEAN DEFAULT FALSE,
  voided_by VARCHAR(255),
  date_voided TIMESTAMP,
  void_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_encounters_patient ON encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_provider ON encounters(provider_id);
CREATE INDEX IF NOT EXISTS idx_encounters_datetime ON encounters(encounter_datetime);