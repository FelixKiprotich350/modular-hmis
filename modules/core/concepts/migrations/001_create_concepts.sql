CREATE TABLE IF NOT EXISTS concepts (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  datatype VARCHAR(50) NOT NULL,
  class VARCHAR(50) NOT NULL,
  is_set BOOLEAN DEFAULT FALSE,
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  retired BOOLEAN DEFAULT FALSE,
  retired_by VARCHAR(255),
  date_retired TIMESTAMP,
  retire_reason TEXT
);

CREATE TABLE IF NOT EXISTS concept_names (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  concept_name_type VARCHAR(50),
  preferred BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (concept_id) REFERENCES concepts(id)
);

CREATE INDEX IF NOT EXISTS idx_concepts_name ON concepts(name);
CREATE INDEX IF NOT EXISTS idx_concept_names_concept ON concept_names(concept_id);