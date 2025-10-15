CREATE TABLE IF NOT EXISTS report_definitions (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  sql_query TEXT,
  parameters JSONB,
  output_format VARCHAR(50) DEFAULT 'JSON',
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS report_executions (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id VARCHAR(255) NOT NULL,
  executed_by VARCHAR(255),
  execution_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  parameters_used JSONB,
  status VARCHAR(50) DEFAULT 'RUNNING',
  result_file_path TEXT,
  error_message TEXT,
  FOREIGN KEY (report_id) REFERENCES report_definitions(id)
);

CREATE TABLE IF NOT EXISTS scheduled_reports (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id VARCHAR(255) NOT NULL,
  schedule_expression VARCHAR(100),
  recipients TEXT,
  next_execution TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES report_definitions(id)
);

CREATE INDEX IF NOT EXISTS idx_executions_report ON report_executions(report_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_next ON scheduled_reports(next_execution);