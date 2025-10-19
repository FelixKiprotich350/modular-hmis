import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ProgramService } from './services/program.service';
import { Program, ProgramEnrollment } from './models/program.model';

@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post()
  async createProgram(@Body() createProgramDto: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.programService.createProgram(createProgramDto);
  }

  @Post('enrollments')
  async enrollPatient(@Body() enrollmentDto: Omit<ProgramEnrollment, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.programService.enrollPatient(enrollmentDto);
  }

  @Get('enrollments/patient/:patientId')
  async getPatientEnrollments(@Param('patientId') patientId: string) {
    return this.programService.getPatientEnrollments(patientId);
  }

  @Put('enrollments/:id/complete')
  async completeEnrollment(@Param('id') enrollmentId: string, @Body() data: { outcome?: string }) {
    return this.programService.completeEnrollment(enrollmentId, data.outcome);
  }
}