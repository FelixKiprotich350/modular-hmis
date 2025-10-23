import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { PatientQueueService } from './services/patientqueue.service';
import { CreateQueueEntryDto, UpdateQueueEntryDto } from './dto/create-queue-entry.dto';

@ApiTags('Patient Queue')
@Controller({ path: 'patient-queue', version: '1' })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class PatientQueueController {
  constructor(@Inject('patientQueueService') private readonly queueService: PatientQueueService) {}

  @Post()
  @Privileges('create_patients')
  @ApiOperation({ summary: 'Add patient to queue' })
  @ApiResponse({ status: 201, description: 'Patient added to queue' })
  @ApiBody({ type: CreateQueueEntryDto })
  async addToQueue(@Body() createDto: CreateQueueEntryDto) {
    const queueEntry = await this.queueService.addToQueue(createDto);
    return queueEntry;
  }

  @Get('by-type/:type')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get queue by type' })
  async getQueueByType(
    @Param('type') queueType: string,
    @Query('servicePoint') servicePointId?: string
  ) {
    const queue = await this.queueService.getQueueByType(queueType, servicePointId);
    return queue;
  }

  @Get('provider/:providerId')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get provider queue' })
  async getProviderQueue(@Param('providerId') providerId: string) {
    const queue = await this.queueService.getProviderQueue(providerId);
    return queue;
  }

  @Patch(':id/start')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Start service for queue entry' })
  async startService(@Param('id') id: string) {
    const queueEntry = await this.queueService.startService(id);
    return queueEntry;
  }

  @Patch(':id/complete')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Complete service for queue entry' })
  async completeService(@Param('id') id: string) {
    const queueEntry = await this.queueService.completeService(id);
    return queueEntry;
  }

  @Patch(':id/cancel')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Cancel queue entry' })
  async cancelEntry(@Param('id') id: string) {
    const queueEntry = await this.queueService.cancelQueueEntry(id);
    return queueEntry;
  }

  @Patch(':id')
  @Privileges('edit_patients')
  @ApiOperation({ summary: 'Update queue entry' })
  @ApiBody({ type: UpdateQueueEntryDto })
  async updateEntry(@Param('id') id: string, @Body() updateDto: UpdateQueueEntryDto) {
    const queueEntry = await this.queueService.updateQueueEntry(id, updateDto);
    return queueEntry;
  }

  @Get('patient/:patientId/history')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get patient queue history' })
  async getPatientHistory(@Param('patientId') patientId: string) {
    const history = await this.queueService.getPatientQueueHistory(patientId);
    return history;
  }

  @Get('stats')
  @Privileges('view_patients')
  @ApiOperation({ summary: 'Get queue statistics' })
  async getQueueStats(
    @Query('type') queueType?: string,
    @Query('servicePoint') servicePointId?: string
  ) {
    const stats = await this.queueService.getQueueStats(queueType, servicePointId);
    return stats;
  }
}