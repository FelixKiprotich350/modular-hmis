CREATE TABLE IF NOT EXISTS facilities (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS facility_settings (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  key VARCHAR(255) NOT NULL,
  value TEXT,
  data_type VARCHAR(50) DEFAULT 'string',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(facility_id, category, key)
);

CREATE INDEX IF NOT EXISTS idx_facility_settings_facility ON facility_settings(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_settings_category ON facility_settings(category);

INSERT INTO facilities (name, code, type, address) VALUES
('Default Health Facility', 'HF001', 'Hospital', 'Main Street, City')
ON CONFLICT (code) DO NOTHING;