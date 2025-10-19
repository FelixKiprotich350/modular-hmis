import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { Order } from './models/order.model';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get('patient/:patientId')
  async getPatientOrders(@Param('patientId') patientId: string) {
    return this.orderService.getPatientOrders(patientId);
  }

  @Put(':id/discontinue')
  async discontinueOrder(@Param('id') orderId: string, @Body() data: { reason: string }) {
    return this.orderService.discontinueOrder(orderId, data.reason);
  }
}