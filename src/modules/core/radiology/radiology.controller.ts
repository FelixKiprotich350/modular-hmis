import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Inject,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RadiologyService } from "./services/radiology.service";
import { Radiology } from "./models/radiology.model";

@ApiTags("Radiology")
@Controller({ path: "radiology", version: "1" })
export class RadiologyController {
  constructor(
    @Inject("radiologyService")
    private readonly radiologyService: RadiologyService
  ) {}

  @Post("orders")
  async createRadiologyOrder(
    @Body() createOrderDto: Omit<Radiology, "id" | "createdAt" | "updatedAt">
  ) {
    const order = await this.radiologyService.createRadiologyOrder(
      createOrderDto
    );
    return order;
  }

  @Get("studies")
  async getRadiologyStudies() {
    const studies = await this.radiologyService.getRadiologyStudies();
    return { studies };
  }

  @Get("modalities")
  async getRadiologyModalities() {
    const modalities = await this.radiologyService.getRadiologyModalities();
    return { modalities };
  }

  @Get("studies/modality/:modality")
  async getStudiesByModality(@Param("modality") modality: string) {
    const studies = await this.radiologyService.getStudiesByModality(modality);
    return { studies, modality };
  }

  @Get("orders/patient/:patientId")
  async getPatientRadiologyOrders(
    @Param("patientId") patientId: string,
    @Query("status") status?: string
  ) {
    const orders = await this.radiologyService.getPatientRadiologyOrders(
      patientId,
      status
    );
    return { orders, patientId, status };
  }

  @Get("orders/status/:status")
  async getOrdersByStatus(@Param("status") status: string) {
    const orders = await this.radiologyService.getOrdersByStatus(status);
    return { orders, status };
  }

  @Get("orders/pending-reports")
  async getPendingReports() {
    const orders = await this.radiologyService.getPendingReports();
    return { orders };
  }

  @Get("orders/scheduled")
  async getScheduledStudies(@Query("date") date?: string) {
    const studyDate = date ? new Date(date) : undefined;
    const orders = await this.radiologyService.getScheduledStudies(studyDate);
    return { orders, date };
  }

  @Put("orders/:id/schedule")
  async scheduleStudy(
    @Param("id") orderId: string,
    @Body() data: { scheduledAt: Date }
  ) {
    const order = await this.radiologyService.scheduleStudy(
      orderId,
      data.scheduledAt
    );
    return order;
  }

  @Put("orders/:id/start")
  async startStudy(
    @Param("id") orderId: string,
    @Body() data: { performedBy: string }
  ) {
    const order = await this.radiologyService.startStudy(
      orderId,
      data.performedBy
    );
    return order;
  }

  @Put("orders/:id/report")
  async updateReport(
    @Param("id") id: string,
    @Body() data: { findings: string; impression: string; radiologist: string }
  ) {
    const order = await this.radiologyService.updateRadiologyResult(
      id,
      data.findings,
      data.impression,
      data.radiologist
    );
    return order;
  }

  @Put("orders/:id/cancel")
  async cancelOrder(
    @Param("id") id: string,
    @Body() data: { reason?: string }
  ) {
    const order = await this.radiologyService.cancelRadiologyOrder(
      id,
      data.reason
    );
    return order;
  }

  @Get("orders")
  async listOrders() {
    const orders = await this.radiologyService.listRadiologyOrders();
    return { orders };
  }

  @Get("orders/:id")
  async getOrder(@Param("id") id: string) {
    const order = await this.radiologyService.getRadiologyOrder(id);
    return { order };
  }
}
