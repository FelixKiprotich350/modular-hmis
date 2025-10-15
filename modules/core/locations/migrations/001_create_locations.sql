CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address1 VARCHAR(255),
  address2 VARCHAR(255),
  city_village VARCHAR(255),
  state_province VARCHAR(255),
  postal_code VARCHAR(50),
  country VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  parent_location VARCHAR(255),
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  retired BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);
CREATE INDEX IF NOT EXISTS idx_locations_parent ON locations(parent_location);