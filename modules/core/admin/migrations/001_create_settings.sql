CREATE TABLE IF NOT EXISTS system_settings (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_settings (key, value, description) VALUES
('system.name', 'Health Management Information System', 'System name'),
('system.version', '1.0.0', 'System version'),
('system.timezone', 'UTC', 'Default timezone'),
('system.language', 'en', 'Default language')
ON CONFLICT (key) DO NOTHING;