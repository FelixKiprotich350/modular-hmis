CREATE TABLE IF NOT EXISTS providers (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  identifier VARCHAR(255) UNIQUE,
  description TEXT,
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  retired BOOLEAN DEFAULT FALSE,
  retired_by VARCHAR(255),
  date_retired TIMESTAMP,
  retire_reason TEXT
);

CREATE TABLE IF NOT EXISTS provider_attributes (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id VARCHAR(255) NOT NULL,
  attribute_type VARCHAR(100) NOT NULL,
  value_reference TEXT,
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES providers(id)
);

CREATE INDEX IF NOT EXISTS idx_providers_identifier ON providers(identifier);
CREATE INDEX IF NOT EXISTS idx_provider_attrs_provider ON provider_attributes(provider_id);