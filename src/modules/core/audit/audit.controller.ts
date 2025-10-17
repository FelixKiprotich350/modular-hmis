import { Controller, Get, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Audit')
@Controller('api/audit')
export class AuditController {
  @Get('logs')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiResponse({ status: 200, description: 'List of audit logs' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'resource', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getLogs(
    @Query('userId') userId?: string,
    @Query('resource') resource?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return { 
      message: 'Audit logs', 
      logs: [],
      filters: { userId, resource, startDate, endDate }
    };
  }

  @Get('user-activity')
  @ApiOperation({ summary: 'Get current user activity logs' })
  getUserActivity(@Headers('authorization') token: string) {
    return { message: 'User activity logs', logs: [] };
  }
}