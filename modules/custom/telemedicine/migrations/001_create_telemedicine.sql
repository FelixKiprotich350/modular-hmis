CREATE TABLE IF NOT EXISTS telemedicine_sessions (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id VARCHAR(255),
  patient_id VARCHAR(255) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  session_type VARCHAR(50) DEFAULT 'VIDEO_CALL',
  session_url TEXT,
  session_token VARCHAR(255),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  recording_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS telemedicine_notes (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  note_type VARCHAR(50) DEFAULT 'CLINICAL',
  content TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES telemedicine_sessions(id)
);

CREATE TABLE IF NOT EXISTS telemedicine_prescriptions (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  patient_id VARCHAR(255) NOT NULL,
  medication VARCHAR(255),
  dosage VARCHAR(100),
  instructions TEXT,
  digital_signature TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES telemedicine_sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_patient ON telemedicine_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_provider ON telemedicine_sessions(provider_id);