import { Injectable } from '@nestjs/common';
import { AuditService } from '../../modules/core/audit/services/audit.service';
import { PrismaService } from '../prisma.service';
import { AUDIT_CONFIG, SECURITY_EVENTS } from '../audit-config';

@Injectable()
export class AuditManagerService {
  private auditService: AuditService;

  constructor(private prisma: PrismaService) {
    this.auditService = new AuditService(prisma);
  }

  async logSecurityEvent(userId: string, event: keyof typeof SECURITY_EVENTS, details?: any, ipAddress?: string): Promise<void> {
    if (!AUDIT_CONFIG.enabled) return;

    await this.auditService.logSecurityEvent(
      userId,
      SECURITY_EVENTS[event],
      details,
      ipAddress
    );
  }

  async logCriticalAction(userId: string, action: string, resource: string, resourceId?: string, details?: any): Promise<void> {
    if (!AUDIT_CONFIG.enabled) return;

    if (AUDIT_CONFIG.criticalActions.includes(action)) {
      await this.auditService.logCustomAction(userId, `CRITICAL: ${action}`, resource, resourceId, details);
    } else {
      await this.auditService.logCustomAction(userId, action, resource, resourceId, details);
    }
  }

  async logModuleOperation(userId: string, moduleName: string, operation: string, details?: any): Promise<void> {
    if (!AUDIT_CONFIG.enabled) return;

    await this.auditService.logCustomAction(
      userId,
      `Module ${moduleName}: ${operation}`,
      'module',
      moduleName,
      details
    );
  }

  async logDataAccess(userId: string, resource: string, resourceId: string, accessType: 'read' | 'write' | 'delete'): Promise<void> {
    if (!AUDIT_CONFIG.enabled) return;

    if (AUDIT_CONFIG.sensitiveResources.includes(resource)) {
      await this.auditService.logCustomAction(
        userId,
        `SENSITIVE: ${accessType.toUpperCase()} ${resource}`,
        resource,
        resourceId,
        { accessType, sensitive: true }
      );
    }
  }

  async logSystemEvent(event: string, details?: any): Promise<void> {
    if (!AUDIT_CONFIG.enabled) return;

    await this.auditService.logCustomAction(
      'system',
      `SYSTEM: ${event}`,
      'system',
      undefined,
      details
    );
  }

  shouldAuditResource(resource: string): boolean {
    return AUDIT_CONFIG.auditAllOperations || AUDIT_CONFIG.sensitiveResources.includes(resource);
  }

  shouldExcludeUrl(url: string): boolean {
    return AUDIT_CONFIG.excludePatterns.some(pattern => url.includes(pattern));
  }
}