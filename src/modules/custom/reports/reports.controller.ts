import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateReportDto {
  reportType: string;
  title: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters?: any;
}

class UpdateReportDto {
  title?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  filters?: any;
  status?: string;
}

@ApiTags('Reports')
@Controller('api/reports')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class ReportsController {
  @Post()
  @Privileges('generate_reports')
  @ApiOperation({ summary: 'Generate report' })
  @ApiResponse({ status: 201, description: 'Report generated' })
  @ApiBody({ type: CreateReportDto })
  create(@Body() createDto: CreateReportDto) {
    return { message: 'Report generated', data: createDto };
  }

  @Get()
  @Privileges('view_reports')
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, description: 'List of reports' })
  findAll() {
    return { message: 'Reports API', data: [] };
  }

  @Get(':id')
  @Privileges('view_reports')
  @ApiOperation({ summary: 'Get report by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Report ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('generate_reports')
  @ApiOperation({ summary: 'Update report' })
  @ApiBody({ type: UpdateReportDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateReportDto) {
    return { message: `Report ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('generate_reports')
  @ApiOperation({ summary: 'Delete report' })
  remove(@Param('id') id: string) {
    return { message: `Report ${id} deleted` };
  }
}