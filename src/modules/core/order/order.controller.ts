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
import { OrderService } from "./services/order.service";
import { Order } from "./models/order.model";

@ApiTags("Orders")
@Controller({ path: "orders", version: "1" })
export class OrderController {
  constructor(
    @Inject("orderService") private readonly orderService: OrderService
  ) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: Omit<Order, "id" | "createdAt" | "updatedAt">
  ) {
    const order = await this.orderService.createOrder(createOrderDto);
    return order;
  }

  @Get("types")
  async getOrderTypes() {
    const types = await this.orderService.getOrderTypes();
    return { types };
  }

  @Get("patient/:patientId")
  async getPatientOrders(
    @Param("patientId") patientId: string,
    @Query("status") status?: string
  ) {
    const orders = await this.orderService.getPatientOrders(patientId, status);
    return { orders, patientId, status };
  }

  @Get("provider/:providerId")
  async getOrdersByProvider(@Param("providerId") providerId: string) {
    const orders = await this.orderService.getOrdersByProvider(providerId);
    return { orders, providerId };
  }

  @Get("by-type/:typeId")
  async getOrdersByType(@Param("typeId") orderTypeId: string) {
    const orders = await this.orderService.getOrdersByType(orderTypeId);
    return { orders, orderTypeId };
  }

  @Get("by-status/:status")
  async getOrdersByStatus(@Param("status") status: string) {
    const orders = await this.orderService.getOrdersByStatus(status);
    return { orders, status };
  }

  @Get("by-date")
  async getOrdersByDateRange(
    @Query("start") startDate: string,
    @Query("end") endDate: string
  ) {
    const orders = await this.orderService.getOrdersByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
    return { orders, startDate, endDate };
  }

  @Get("active")
  async getActiveOrders(@Query("patient") patientId?: string) {
    const orders = await this.orderService.getActiveOrders(patientId);
    return { orders, patientId };
  }

  @Get("expired")
  async getExpiredOrders() {
    const orders = await this.orderService.getExpiredOrders();
    return { orders };
  }

  @Put(":id/activate")
  async activateOrder(@Param("id") orderId: string) {
    const order = await this.orderService.activateOrder(orderId);
    return order;
  }

  @Put(":id/discontinue")
  async discontinueOrder(
    @Param("id") orderId: string,
    @Body() data: { reason: string; discontinuedBy: string }
  ) {
    const order = await this.orderService.discontinueOrder(
      orderId,
      data.reason,
      data.discontinuedBy
    );
    return order;
  }

  @Put(":id/renew")
  async renewOrder(
    @Param("id") orderId: string,
    @Body() data: { newAutoExpireDate?: Date }
  ) {
    const order = await this.orderService.renewOrder(
      orderId,
      data.newAutoExpireDate
    );
    return order;
  }

  @Get()
  async listOrders() {
    const orders = await this.orderService.listOrders();
    return { orders };
  }

  @Get(":id")
  async getOrder(@Param("id") id: string) {
    const order = await this.orderService.getOrder(id);
    return { order };
  }

  @Put(":id")
  async updateOrder(
    @Param("id") id: string,
    @Body() updateData: Partial<Order>
  ) {
    const order = await this.orderService.updateOrder(id, updateData);
    return order;
  }

  @Delete(":id")
  async deleteOrder(@Param("id") id: string) {
    const deleted = await this.orderService.deleteOrder(id);
    return deleted;
  }
}
