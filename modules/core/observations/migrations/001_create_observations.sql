CREATE TABLE IF NOT EXISTS observations (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(255) NOT NULL,
  encounter_id VARCHAR(255),
  concept_id VARCHAR(255) NOT NULL,
  obs_datetime TIMESTAMP NOT NULL,
  value_numeric DECIMAL(10,2),
  value_coded VARCHAR(255),
  value_text TEXT,
  value_datetime TIMESTAMP,
  value_boolean BOOLEAN,
  comments TEXT,
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  voided BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_obs_patient ON observations(patient_id);
CREATE INDEX IF NOT EXISTS idx_obs_encounter ON observations(encounter_id);
CREATE INDEX IF NOT EXISTS idx_obs_concept ON observations(concept_id);