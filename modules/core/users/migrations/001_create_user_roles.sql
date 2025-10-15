-- Core user management tables are already in main schema
-- This migration adds any additional user-related functionality

CREATE INDEX IF NOT EXISTS idx_users_username ON "User"(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"(email);