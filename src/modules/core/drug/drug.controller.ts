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
import { DrugService } from "./services/drug.service";
import { Drug, DrugOrder } from "./models/drug.model";

@ApiTags("Drugs")
@Controller({ path: "drugs", version: "1" })
export class DrugController {
  constructor(
    @Inject("drugService") private readonly drugService: DrugService
  ) {}

  @Post()
  async createDrug(
    @Body() createDrugDto: Omit<Drug, "id" | "createdAt" | "updatedAt">
  ) {
    const drug = await this.drugService.createDrug(createDrugDto);
    return drug;
  }

  @Get("search")
  async searchDrugs(@Query("q") query: string) {
    const drugs = await this.drugService.searchDrugs(query);
    return { drugs, query };
  }

  @Get("formulations")
  async getDrugFormulations() {
    const formulations = await this.drugService.getDrugFormulations();
    return { formulations };
  }

  @Get(":id/interactions")
  async getDrugInteractions(@Param("id") drugId: string) {
    const interactions = await this.drugService.getDrugInteractions(drugId);
    return { interactions, drugId };
  }

  @Post("orders")
  async createDrugOrder(
    @Body() createOrderDto: Omit<DrugOrder, "id" | "createdAt" | "updatedAt">
  ) {
    const order = await this.drugService.createDrugOrder(createOrderDto);
    return order;
  }

  @Get("orders/patient/:patientId")
  async getPatientDrugOrders(
    @Param("patientId") patientId: string,
    @Query("status") status?: string
  ) {
    const orders = await this.drugService.getPatientDrugOrders(
      patientId,
      status
    );
    return { orders, patientId, status };
  }

  @Get("orders/active")
  async getActiveDrugOrders(@Query("patient") patientId?: string) {
    const orders = await this.drugService.getActiveDrugOrders(patientId);
    return { orders, patientId };
  }

  @Get("medications/patient/:patientId")
  async getPatientMedications(@Param("patientId") patientId: string) {
    const medications = await this.drugService.getPatientMedications(patientId);
    return { medications, patientId };
  }

  @Post("allergies/check")
  async checkDrugAllergies(
    @Body() data: { patientId: string; drugId: string }
  ) {
    const hasAllergy = await this.drugService.checkDrugAllergies(
      data.patientId,
      data.drugId
    );
    return data.drugId;
  }

  @Put("orders/:id/discontinue")
  async discontinueDrugOrder(
    @Param("id") drugOrderId: string,
    @Body() data: { reason: string; discontinuedBy: string }
  ) {
    const order = await this.drugService.discontinueDrugOrder(
      drugOrderId,
      data.reason,
      data.discontinuedBy
    );
    return order;
  }

  @Put("orders/:id/dispense")
  async dispenseDrugOrder(
    @Param("id") drugOrderId: string,
    @Body() data: { quantityDispensed: number; dispensedBy: string }
  ) {
    const order = await this.drugService.dispenseDrugOrder(
      drugOrderId,
      data.quantityDispensed,
      data.dispensedBy
    );
    return order;
  }

  @Get()
  async listDrugs() {
    const drugs = await this.drugService.listDrugs();
    return { drugs };
  }

  @Get("orders/:id")
  async getDrugOrder(@Param("id") id: string) {
    const order = await this.drugService.getDrugOrder(id);
    return { order };
  }

  @Get(":id")
  async getDrug(@Param("id") id: string) {
    const drug = await this.drugService.getDrug(id);
    return { drug };
  }

  @Put(":id")
  async updateDrug(@Param("id") id: string, @Body() updateData: Partial<Drug>) {
    const drug = await this.drugService.updateDrug(id, updateData);
    return drug;
  }

  @Put("orders/:id")
  async updateDrugOrder(
    @Param("id") id: string,
    @Body() updateData: Partial<DrugOrder>
  ) {
    const order = await this.drugService.updateDrugOrder(id, updateData);
    return order;
  }

  @Delete(":id")
  async deleteDrug(@Param("id") id: string) {
    const deleted = await this.drugService.deleteDrug(id);
    return deleted;
  }
}
