import { Controller, Get, Post, Body, Param, Put, Query, Inject } from '@nestjs/common';
import { LaboratoryService } from './services/laboratory.service';
import { Laboratory } from './models/laboratory.model';

@Controller('api/laboratory')
export class LaboratoryController {
  constructor(@Inject('laboratoryService') private readonly laboratoryService: LaboratoryService) {}

  @Post('orders')
  async createLabOrder(@Body() createOrderDto: Omit<Laboratory, 'id' | 'createdAt' | 'updatedAt'>) {
    const order = await this.laboratoryService.createLabOrder(createOrderDto);
    return { message: 'Lab order created', order };
  }

  @Get('tests')
  async getLabTests() {
    const tests = await this.laboratoryService.getLabTests();
    return { tests };
  }

  @Get('tests/category/:category')
  async getLabTestsByCategory(@Param('category') category: string) {
    const tests = await this.laboratoryService.getLabTestsByCategory(category);
    return { tests, category };
  }

  @Get('orders/patient/:patientId')
  async getPatientLabOrders(@Param('patientId') patientId: string, @Query('status') status?: string) {
    const orders = await this.laboratoryService.getPatientLabOrders(patientId, status);
    return { orders, patientId, status };
  }

  @Get('orders/status/:status')
  async getOrdersByStatus(@Param('status') status: string) {
    const orders = await this.laboratoryService.getLabOrdersByStatus(status);
    return { orders, status };
  }

  @Get('orders/pending')
  async getPendingResults() {
    const orders = await this.laboratoryService.getPendingResults();
    return { orders };
  }

  @Get('results/abnormal')
  async getAbnormalResults(@Query('patient') patientId?: string) {
    const results = await this.laboratoryService.getAbnormalResults(patientId);
    return { results, patientId };
  }

  @Post('specimens')
  async createSpecimen(@Body() specimenData: { patientId: string; specimenType: string; collectedBy: string; barcode?: string }) {
    const specimen = await this.laboratoryService.createSpecimen({
      ...specimenData,
      collectionDate: new Date(),
      status: 'COLLECTED'
    });
    return { message: 'Specimen created', specimen };
  }

  @Get('specimens/barcode/:barcode')
  async getSpecimenByBarcode(@Param('barcode') barcode: string) {
    const specimen = await this.laboratoryService.getSpecimenByBarcode(barcode);
    return { specimen, barcode };
  }

  @Put('orders/:id/collect')
  async collectSpecimen(@Param('id') labOrderId: string, @Body() data: { collectedBy: string }) {
    const order = await this.laboratoryService.collectSpecimen(labOrderId, data.collectedBy);
    return { message: 'Specimen collected', order };
  }

  @Put('orders/:id/result')
  async updateResult(@Param('id') id: string, @Body() data: { result: string; resultValue?: string; abnormal?: boolean }) {
    const order = await this.laboratoryService.updateLabResult(id, data.result, data.resultValue, data.abnormal);
    return { message: 'Result updated', order };
  }

  @Put('orders/:id/cancel')
  async cancelOrder(@Param('id') id: string, @Body() data: { reason?: string }) {
    const order = await this.laboratoryService.cancelLabOrder(id, data.reason);
    return { message: 'Order cancelled', order };
  }

  @Get('orders')
  async listOrders() {
    const orders = await this.laboratoryService.listLabOrders();
    return { orders };
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    const order = await this.laboratoryService.getLabOrder(id);
    return { order };
  }
}