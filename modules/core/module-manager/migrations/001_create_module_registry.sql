CREATE TABLE IF NOT EXISTS module_registry (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  category VARCHAR(20) NOT NULL CHECK (category IN ('core', 'custom')),
  status VARCHAR(20) NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled', 'disabled', 'error')),
  dependencies JSONB DEFAULT '[]',
  installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_loaded TIMESTAMP,
  load_count INTEGER DEFAULT 0,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_module_registry_category ON module_registry(category);
CREATE INDEX IF NOT EXISTS idx_module_registry_status ON module_registry(status);
CREATE INDEX IF NOT EXISTS idx_module_registry_name ON module_registry(name);