import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Inject,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DataExchangeService } from "./services/data-exchange.service";
import { DataExport, DataImport, ETLJob } from "./models/data-exchange.model";

@ApiTags("Data Exchange")
@Controller({ path: "data-exchange", version: "1" })
export class DataExchangeController {
  constructor(
    @Inject("dataExchangeService")
    private readonly dataExchangeService: DataExchangeService
  ) {}

  @Get("formats")
  async getDataFormats() {
    const formats = await this.dataExchangeService.getDataFormats();
    return { formats };
  }

  @Post("export")
  async createExportJob(
    @Body() createExportDto: Omit<DataExport, "id" | "createdAt">
  ) {
    const job = await this.dataExchangeService.createExportJob(createExportDto);
    return job;
  }

  @Post("export/:id/run")
  async runExportJob(@Param("id") exportId: string) {
    const job = await this.dataExchangeService.runExportJob(exportId);
    return job;
  }

  @Get("export/:id/data")
  async exportData(@Param("id") exportId: string) {
    const data = await this.dataExchangeService.exportData(exportId);
    return { data };
  }

  @Post("import")
  async createImportJob(
    @Body() createImportDto: Omit<DataImport, "id" | "createdAt">
  ) {
    const job = await this.dataExchangeService.createImportJob(createImportDto);
    return job;
  }

  @Post("import/:id/run")
  async runImportJob(
    @Param("id") importId: string,
    @Body() data: { data: any[] }
  ) {
    const validation = await this.dataExchangeService.validateImportData(
      data.data,
      {}
    );
    if (!validation.valid) {
      return validation.errors;
    }

    const result = await this.dataExchangeService.importData(
      importId,
      data.data
    );
    return result;
  }

  @Post("import/validate")
  async validateImportData(@Body() data: { data: any[]; mappingConfig: any }) {
    const validation = await this.dataExchangeService.validateImportData(
      data.data,
      data.mappingConfig
    );
    return { validation };
  }

  @Post("transform")
  async transformData(@Body() data: { data: any[]; transformConfig: any }) {
    const transformedData = await this.dataExchangeService.transformData(
      data.data,
      data.transformConfig
    );
    return { transformedData };
  }

  @Post("etl")
  async createETLJob(@Body() createETLDto: Omit<ETLJob, "id">) {
    const job = await this.dataExchangeService.createETLJob(createETLDto);
    return job;
  }

  @Post("etl/:id/run")
  async runETLJob(@Param("id") jobId: string) {
    const success = await this.dataExchangeService.runETLJob(jobId);
    return success;
  }

  @Put("etl/:id/schedule")
  async scheduleETLJob(
    @Param("id") jobId: string,
    @Body() data: { schedule: string }
  ) {
    const job = await this.dataExchangeService.scheduleETLJob(
      jobId,
      data.schedule
    );
    return job;
  }

  @Get("etl")
  async getETLJobs() {
    const jobs = await this.dataExchangeService.getETLJobs();
    return { jobs };
  }

  @Get("export")
  async getExportJobs() {
    const jobs = await this.dataExchangeService.getExportJobs();
    return { jobs };
  }

  @Get("import")
  async getImportJobs() {
    const jobs = await this.dataExchangeService.getImportJobs();
    return { jobs };
  }

  @Get("jobs/status/:status")
  async getJobsByStatus(@Param("status") status: string) {
    const jobs = await this.dataExchangeService.getJobsByStatus(status);
    return { jobs, status };
  }

  @Get("jobs/history")
  async getJobHistory(@Query("type") jobType?: string) {
    const history = await this.dataExchangeService.getJobHistory(jobType);
    return { history, jobType };
  }

  @Put("jobs/:id/cancel")
  async cancelJob(
    @Param("id") jobId: string,
    @Query("type") jobType: "export" | "import" | "etl"
  ) {
    const cancelled = await this.dataExchangeService.cancelJob(jobId, jobType);
    return cancelled;
  }

  @Get("export/:id")
  async getExportJob(@Param("id") id: string) {
    const job = await this.dataExchangeService.getExportJob(id);
    return { job };
  }

  @Get("import/:id")
  async getImportJob(@Param("id") id: string) {
    const job = await this.dataExchangeService.getImportJob(id);
    return { job };
  }

  @Put("export/:id")
  async updateExportJob(
    @Param("id") id: string,
    @Body() updateData: Partial<DataExport>
  ) {
    const job = await this.dataExchangeService.updateExportJob(id, updateData);
    return job;
  }

  @Put("import/:id")
  async updateImportJob(
    @Param("id") id: string,
    @Body() updateData: Partial<DataImport>
  ) {
    const job = await this.dataExchangeService.updateImportJob(id, updateData);
    return job;
  }

  @Delete("export/:id")
  async deleteExportJob(@Param("id") id: string) {
    const deleted = await this.dataExchangeService.deleteExportJob(id);
    return deleted;
  }

  @Delete("import/:id")
  async deleteImportJob(@Param("id") id: string) {
    const deleted = await this.dataExchangeService.deleteImportJob(id);
    return deleted;
  }
}
