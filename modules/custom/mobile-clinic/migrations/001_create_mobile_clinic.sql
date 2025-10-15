CREATE TABLE IF NOT EXISTS mobile_units (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_name VARCHAR(255) NOT NULL,
  vehicle_number VARCHAR(100),
  capacity INTEGER,
  equipment_list TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outreach_programs (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name VARCHAR(255) NOT NULL,
  description TEXT,
  target_population VARCHAR(255),
  start_date DATE,
  end_date DATE,
  coordinator VARCHAR(255),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mobile_clinic_visits (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_unit_id VARCHAR(255) NOT NULL,
  program_id VARCHAR(255),
  location_name VARCHAR(255) NOT NULL,
  visit_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  team_members TEXT,
  patients_served INTEGER DEFAULT 0,
  services_provided TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mobile_unit_id) REFERENCES mobile_units(id)
);

CREATE INDEX IF NOT EXISTS idx_visits_unit ON mobile_clinic_visits(mobile_unit_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON mobile_clinic_visits(visit_date);