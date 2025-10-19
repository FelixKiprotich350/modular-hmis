import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DrugService } from './services/drug.service';
import { Drug, DrugOrder } from './models/drug.model';

@Controller('drug')
export class DrugController {
  constructor(private readonly drugService: DrugService) {}

  @Post()
  async createDrug(@Body() createDrugDto: Omit<Drug, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.drugService.createDrug(createDrugDto);
  }

  @Post('orders')
  async createDrugOrder(@Body() createOrderDto: Omit<DrugOrder, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.drugService.createDrugOrder(createOrderDto);
  }

  @Get('search')
  async searchDrugs(@Query('name') name: string) {
    return this.drugService.getDrugsByName(name);
  }

  @Get('orders/patient/:patientId')
  async getPatientDrugOrders(@Param('patientId') patientId: string) {
    return this.drugService.getPatientDrugOrders(patientId);
  }
}