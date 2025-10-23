import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { Audit } from '../../../core/decorators/audit.decorator';
import { User } from '../../../core/decorators/user.decorator';
import { InventoryService } from './services/inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@ApiTags('Inventory')
@Controller({ path: 'inventory', version: '1' })
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(@Inject('inventoryService') private readonly inventoryService: InventoryService) {}

  @Post()
  @Privileges('manage_inventory')
  @Audit('Create inventory item')
  @ApiOperation({ summary: 'Create inventory item' })
  @ApiResponse({ status: 201, description: 'Inventory item created successfully' })
  @ApiBody({ type: CreateInventoryDto })
  async create(@Body() createDto: CreateInventoryDto) {
    const item = await this.inventoryService.createItem(createDto);
    return item;
  }

  @Get()
  @Privileges('view_inventory')
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiResponse({ status: 200, description: 'List of inventory items retrieved successfully' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'search', required: false, description: 'Search items by name or category' })
  async findAll(@Query('category') category?: string, @Query('search') search?: string) {
    if (search) {
      const items = await this.inventoryService.searchItems(search);
      return items;
    }
    if (category) {
      const items = await this.inventoryService.getItemsByCategory(category);
      return items;
    }
    const items = await this.inventoryService.listItems();
    return items;
  }

  @Get('low-stock')
  @Privileges('view_inventory')
  @ApiOperation({ summary: 'Get low stock items' })
  @ApiResponse({ status: 200, description: 'Low stock items retrieved successfully' })
  async getLowStock() {
    const items = await this.inventoryService.getLowStockItems();
    return items;
  }

  @Get('expiring')
  @Privileges('view_inventory')
  @ApiOperation({ summary: 'Get expiring items' })
  @ApiResponse({ status: 200, description: 'Expiring items retrieved successfully' })
  @ApiQuery({ name: 'days', required: false, description: 'Days until expiration (default: 30)' })
  async getExpiring(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days) : 30;
    const items = await this.inventoryService.getExpiringItems(daysNumber);
    return items;
  }

  @Get('report')
  @Privileges('view_inventory')
  @ApiOperation({ summary: 'Generate stock report' })
  @ApiResponse({ status: 200, description: 'Stock report generated successfully' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter report by category' })
  async generateReport(@Query('category') category?: string) {
    const report = await this.inventoryService.generateStockReport(category);
    return report;
  }

  @Get(':id')
  @Privileges('view_inventory')
  @ApiOperation({ summary: 'Get inventory item by ID' })
  @ApiResponse({ status: 200, description: 'Inventory item retrieved successfully' })
  async findOne(@Param('id') id: string) {
    const item = await this.inventoryService.getItem(id);
    return item;
  }

  @Post(':id/adjust-stock')
  @Privileges('manage_inventory')
  @Audit('Adjust stock')
  @ApiOperation({ summary: 'Adjust stock quantity' })
  @ApiResponse({ status: 200, description: 'Stock adjusted successfully' })
  async adjustStock(
    @Param('id') id: string,
    @Body() adjustmentData: {
      quantity: number;
      movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
      reason?: string;
    },
    @User() user: any
  ) {
    const result = await this.inventoryService.adjustStock(
      id,
      adjustmentData.quantity,
      adjustmentData.movementType,
      adjustmentData.reason,
      user.id
    );
    return result;
  }

  @Post('transfer')
  @Privileges('manage_inventory')
  @Audit('Transfer stock')
  @ApiOperation({ summary: 'Transfer stock between items' })
  @ApiResponse({ status: 200, description: 'Stock transferred successfully' })
  async transferStock(
    @Body() transferData: {
      fromItemId: string;
      toItemId: string;
      quantity: number;
    },
    @User() user: any
  ) {
    const result = await this.inventoryService.transferStock(
      transferData.fromItemId,
      transferData.toItemId,
      transferData.quantity,
      user.id
    );
    return result;
  }

  @Patch(':id')
  @Privileges('manage_inventory')
  @Audit('Update inventory item')
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiResponse({ status: 200, description: 'Inventory item updated successfully' })
  @ApiBody({ type: UpdateInventoryDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateInventoryDto) {
    const item = await this.inventoryService.updateItem(id, updateDto);
    return item;
  }

  @Delete(':id')
  @Privileges('manage_inventory')
  @Audit('Delete inventory item')
  @ApiOperation({ summary: 'Delete inventory item' })
  @ApiResponse({ status: 200, description: 'Inventory item deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.inventoryService.deleteItem(id);
    return 'Inventory item deleted successfully';
  }
}