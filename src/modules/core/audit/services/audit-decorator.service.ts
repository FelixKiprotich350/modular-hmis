import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';

export interface AuditOptions {
  action?: string;
  resource?: string;
  includeBody?: boolean;
  includeResponse?: boolean;
}

export const Audit = (options: AuditOptions = {}) => SetMetadata(AUDIT_KEY, options);

// Usage examples:
// @Audit({ action: 'CREATE_PATIENT', resource: 'patients' })
// @Audit({ action: 'LOGIN', resource: 'auth', includeBody: false })