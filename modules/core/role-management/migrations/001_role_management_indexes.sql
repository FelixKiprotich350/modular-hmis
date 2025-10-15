-- Additional indexes for role management performance
CREATE INDEX IF NOT EXISTS idx_user_role_user ON "UserRole"("userId");
CREATE INDEX IF NOT EXISTS idx_user_role_role ON "UserRole"("roleId");
CREATE INDEX IF NOT EXISTS idx_role_privilege_role ON "RolePrivilege"("roleId");
CREATE INDEX IF NOT EXISTS idx_role_privilege_privilege ON "RolePrivilege"("privilegeId");