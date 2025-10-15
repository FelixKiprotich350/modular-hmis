CREATE TABLE IF NOT EXISTS inventory_items (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit_of_measure VARCHAR(50),
  reorder_level INTEGER DEFAULT 0,
  unit_cost DECIMAL(10,2),
  supplier VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_stock (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id VARCHAR(255) NOT NULL,
  location_id VARCHAR(255) NOT NULL,
  quantity_on_hand INTEGER DEFAULT 0,
  quantity_reserved INTEGER DEFAULT 0,
  expiry_date DATE,
  batch_number VARCHAR(100),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id VARCHAR(255) NOT NULL,
  location_id VARCHAR(255) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  reference_number VARCHAR(100),
  notes TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

CREATE INDEX IF NOT EXISTS idx_stock_item ON inventory_stock(item_id);
CREATE INDEX IF NOT EXISTS idx_transactions_item ON inventory_transactions(item_id);