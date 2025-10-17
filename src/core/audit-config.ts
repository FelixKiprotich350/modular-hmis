export interface AuditConfig {
  enabled: boolean;
  auditAllOperations: boolean;
  sensitiveResources: string[];
  criticalActions: string[];
  excludePatterns: string[];
  retentionDays: number;
}

export const AUDIT_CONFIG: AuditConfig = {
  enabled: true,
  auditAllOperations: true,
  sensitiveResources: [
    'users',
    'roles',
    'patients',
    'encounters',
    'observations',
    'providers',
    'audit',
    'settings',
    'inventory',
    'billing',
    'pharmacy'
  ],
  criticalActions: [
    'Create user',
    'Delete user',
    'Update user roles',
    'Create patient',
    'Delete patient',
    'Create encounter',
    'Delete encounter',
    'Create observation',
    'Delete observation',
    'Update inventory',
    'Delete inventory item',
    'Process billing',
    'Dispense medication',
    'Login',
    'Logout',
    'Failed login',
    'Password change',
    'Role assignment',
    'Privilege modification'
  ],
  excludePatterns: [
    '/health',
    '/api/health',
    '/swagger',
    '/api-docs'
  ],
  retentionDays: 365
};

export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_FAILED: 'Login failed',
  LOGOUT: 'User logout',
  PASSWORD_CHANGE: 'Password changed',
  ROLE_ASSIGNED: 'Role assigned to user',
  PRIVILEGE_GRANTED: 'Privilege granted',
  PRIVILEGE_REVOKED: 'Privilege revoked',
  UNAUTHORIZED_ACCESS: 'Unauthorized access attempt',
  SUSPICIOUS_ACTIVITY: 'Suspicious activity detected'
};