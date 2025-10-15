CREATE TABLE IF NOT EXISTS lab_tests (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(100),
  description TEXT,
  test_group VARCHAR(255),
  sort_weight INTEGER DEFAULT 0,
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  retired BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS lab_orders (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(255) NOT NULL,
  encounter_id VARCHAR(255),
  test_id VARCHAR(255) NOT NULL,
  urgency VARCHAR(50) DEFAULT 'ROUTINE',
  instructions TEXT,
  orderer VARCHAR(255),
  date_ordered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  specimen_source VARCHAR(255),
  status VARCHAR(50) DEFAULT 'NEW'
);

CREATE TABLE IF NOT EXISTS lab_results (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(255) NOT NULL,
  test_id VARCHAR(255) NOT NULL,
  value VARCHAR(255),
  units VARCHAR(50),
  reference_range VARCHAR(255),
  abnormal BOOLEAN DEFAULT FALSE,
  result_date TIMESTAMP,
  comments TEXT,
  creator VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES lab_orders(id)
);

CREATE INDEX IF NOT EXISTS idx_lab_orders_patient ON lab_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_order ON lab_results(order_id);