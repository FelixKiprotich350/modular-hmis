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
}