import { PrismaClient } from '@prisma/client';

export interface AuditLogData {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  constructor(private db: PrismaClient) {}

  async log(data: AuditLogData, tx?: any): Promise<void> {
    try {
      const db = tx || this.db;
      await db.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          details: data.details,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent
        }
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

  async logCustomAction(userId: string, action: string, resource: string, resourceId?: string, details?: any): Promise<void> {
    await this.log({
      userId,
      action,
      resource,
      resourceId,
      details
    });
  }

  async logSecurityEvent(userId: string, event: string, details?: any, ipAddress?: string): Promise<void> {
    await this.log({
      userId,
      action: `SECURITY: ${event}`,
      resource: 'security',
      details,
      ipAddress
    });
  }

  async getLogs(userId?: string, resource?: string, limit = 100) {
    return this.db.auditLog.findMany({
      where: {
        ...(userId && { userId }),
        ...(resource && { resource })
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  async getLogsByDateRange(startDate: Date, endDate: Date) {
    return this.db.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { timestamp: 'desc' }
    });
  }

  async getLogsByUser(userId: string, limit = 50) {
    return this.db.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  async getSecurityLogs(limit = 100) {
    return this.db.auditLog.findMany({
      where: {
        action: {
          startsWith: 'SECURITY:'
        }
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  async getFailedOperations(limit = 100) {
    return this.db.auditLog.findMany({
      where: {
        OR: [
          { action: { startsWith: 'FAILED:' } },
          { details: { path: ['success'], equals: false } }
        ]
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  async getResourceActivity(resource: string, resourceId?: string, limit = 50) {
    return this.db.auditLog.findMany({
      where: {
        resource,
        ...(resourceId && { resourceId })
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  async getUserActivitySummary(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.db.auditLog.groupBy({
      by: ['action'],
      where: {
        userId,
        timestamp: { gte: startDate }
      },
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } }
    });
  }
}