import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Inject,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProgramService } from "./services/program.service";
import { Program, ProgramEnrollment } from "./models/program.model";

@ApiTags("Programs")
@Controller({ path: "programs", version: "1" })
export class ProgramController {
  constructor(
    @Inject("programService") private readonly programService: ProgramService
  ) {}

  @Post()
  async createProgram(
    @Body() createProgramDto: Omit<Program, "id" | "createdAt" | "updatedAt">
  ) {
    const program = await this.programService.createProgram(createProgramDto);
    return program;
  }

  @Get("workflows")
  async getProgramWorkflows() {
    const workflows = await this.programService.getProgramWorkflows();
    return { workflows };
  }

  @Post("enrollments")
  async enrollPatient(
    @Body()
    enrollmentDto: Omit<ProgramEnrollment, "id" | "createdAt" | "updatedAt">
  ) {
    const enrollment = await this.programService.enrollPatient(enrollmentDto);
    return enrollment;
  }

  @Get("enrollments/patient/:patientId")
  async getPatientEnrollments(@Param("patientId") patientId: string) {
    const enrollments = await this.programService.getPatientEnrollments(
      patientId
    );
    return { enrollments, patientId };
  }

  @Get("enrollments/active")
  async getActiveEnrollments() {
    const enrollments = await this.programService.getActiveEnrollments();
    return { enrollments };
  }

  @Get(":id/enrollments")
  async getProgramEnrollments(@Param("id") programId: string) {
    const enrollments = await this.programService.getProgramEnrollments(
      programId
    );
    return { enrollments, programId };
  }

  @Put("enrollments/:id/complete")
  async completeEnrollment(
    @Param("id") enrollmentId: string,
    @Body() data: { outcome?: string; completionDate?: Date }
  ) {
    const enrollment = await this.programService.completeEnrollment(
      enrollmentId,
      data.outcome,
      data.completionDate
    );
    return enrollment;
  }

  @Put("enrollments/:id/state")
  async changeEnrollmentState(
    @Param("id") enrollmentId: string,
    @Body() data: { stateId: string; startDate?: Date }
  ) {
    const stateChange = await this.programService.changeEnrollmentState(
      enrollmentId,
      data.stateId,
      data.startDate
    );
    return stateChange;
  }

  @Get("enrollments/:id/states")
  async getEnrollmentStates(@Param("id") enrollmentId: string) {
    const states = await this.programService.getEnrollmentStates(enrollmentId);
    return { states, enrollmentId };
  }

  @Get()
  async listPrograms() {
    const programs = await this.programService.listPrograms();
    return { programs };
  }

  @Get(":id")
  async getProgram(@Param("id") id: string) {
    const program = await this.programService.getProgram(id);
    return { program };
  }

  @Put(":id")
  async updateProgram(
    @Param("id") id: string,
    @Body() updateData: Partial<Program>
  ) {
    const program = await this.programService.updateProgram(id, updateData);
    return program;
  }

  @Delete(":id")
  async deleteProgram(@Param("id") id: string) {
    const deleted = await this.programService.deleteProgram(id);
    return deleted;
  }
}
