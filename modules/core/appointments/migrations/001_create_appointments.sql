CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(255) NOT NULL,
  provider_id VARCHAR(255),
  location_id VARCHAR(255),
  appointment_type VARCHAR(100),
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  reason TEXT,
  comments TEXT,
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled BOOLEAN DEFAULT FALSE,
  cancelled_by VARCHAR(255),
  date_cancelled TIMESTAMP,
  cancel_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON appointments(start_datetime);