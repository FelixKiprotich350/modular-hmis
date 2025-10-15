import { PrismaClient } from '@prisma/client';

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  userId: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export class AuditService {
  constructor(private db: PrismaClient) {}

  async log(data: Omit<AuditLog, 'id' | 'timestamp'>) {
    try {
      const result = await this.db.$executeRaw`
        INSERT INTO audit_logs (action, resource, user_id, details, ip_address, user_agent, timestamp)
        VALUES (${data.action}, ${data.resource}, ${data.userId}, ${JSON.stringify(data.details || {})}, ${data.ipAddress || null}, ${data.userAgent || null}, NOW())
      `;
      
      console.log(`Audit: ${data.action} on ${data.resource} by ${data.userId}`);
      return 'audit_' + Date.now();
    } catch (error) {
      console.error('Failed to log audit:', error);
      throw error;
    }
  }

  async getLogs(filters: { 
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  } = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.userId) {
      whereClause += ` AND user_id = $${paramIndex++}`;
      params.push(filters.userId);
    }
    if (filters.action) {
      whereClause += ` AND action = $${paramIndex++}`;
      params.push(filters.action);
    }
    if (filters.resource) {
      whereClause += ` AND resource = $${paramIndex++}`;
      params.push(filters.resource);
    }
    if (filters.startDate) {
      whereClause += ` AND timestamp >= $${paramIndex++}`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      whereClause += ` AND timestamp <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    const logs = await this.db.$queryRawUnsafe(`
      SELECT id, action, resource, user_id, details, ip_address, user_agent, timestamp
      FROM audit_logs 
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, ...params, limit, offset);

    const totalCount = await this.db.$queryRawUnsafe(`
      SELECT COUNT(*) as count FROM audit_logs ${whereClause}
    `, ...params.slice(0, -2));

    return {
      logs,
      pagination: {
        page,
        limit,
        total: Number((totalCount as any[])[0]?.count || 0),
        pages: Math.ceil(Number((totalCount as any[])[0]?.count || 0) / limit)
      }
    };
  }

  async getLog(id: string) {
    const logs = await this.db.$queryRaw`
      SELECT * FROM audit_logs WHERE id = ${id}
    `;
    return (logs as any[])[0] || null;
  }

  async exportLogs(startDate: Date, endDate: Date, format: string = 'csv') {
    const exportId = 'export_' + Date.now();
    
    // In a real implementation, this would generate the export file
    console.log(`Exporting audit logs from ${startDate} to ${endDate} in ${format} format`);
    
    return { exportId, status: 'processing', format };
  }
}