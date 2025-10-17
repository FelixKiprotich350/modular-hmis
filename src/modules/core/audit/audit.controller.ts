import { Controller, Get, Query, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './services/audit.service';
import { PrismaService } from '../../../core/prisma.service';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { User } from '../../../core/decorators/user.decorator';

@ApiTags('Audit')
@Controller('api/audit')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class AuditController {
  private auditService: AuditService;

  constructor(private prisma: PrismaService) {
    this.auditService = new AuditService(prisma);
  }

  @Get('logs')
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiResponse({ status: 200, description: 'List of audit logs' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'resource', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getLogs(
    @Query('userId') userId?: string,
    @Query('resource') resource?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    let logs;
    
    if (startDate && endDate) {
      logs = await this.auditService.getLogsByDateRange(new Date(startDate), new Date(endDate));
    } else {
      logs = await this.auditService.getLogs(userId, resource);
    }
    
    return { message: 'Audit logs', logs, count: logs.length };
  }

  @Get('user-activity')
  @ApiOperation({ summary: 'Get current user activity logs' })
  async getUserActivity(@User() user: any) {
    const logs = await this.auditService.getLogsByUser(user.userId);
    return { message: 'User activity logs', logs, count: logs.length };
  }

  @Get('recent')
  @Privileges('manage_users')
  @ApiOperation({ summary: 'Get recent audit logs' })
  async getRecentLogs() {
    const logs = await this.auditService.getLogs(undefined, undefined, 50);
    return { message: 'Recent audit logs', logs, count: logs.length };
  }
}