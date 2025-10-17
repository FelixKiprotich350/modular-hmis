import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { Audit } from '../../../core/decorators/audit.decorator';
import { AuditInterceptor } from '../../../core/interceptors/audit.interceptor';
import { User } from '../../../core/decorators/user.decorator';


class CreateInventoryDto {
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  supplier?: string;
  expirationDate?: string;
}

class UpdateInventoryDto {
  itemName?: string;
  category?: string;
  quantity?: number;
  unitPrice?: number;
  supplier?: string;
  expirationDate?: string;
}

@ApiTags('Inventory')
@Controller('api/inventory')
@UseGuards(AuthGuard, PrivilegeGuard)
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class InventoryController {
  @Post()
  @Privileges('manage_inventory')
  @Audit('Create inventory item')
  @ApiOperation({ summary: 'Create inventory item' })
  @ApiResponse({ status: 201, description: 'Inventory item created' })
  @ApiBody({ type: CreateInventoryDto })
  create(@Body() createDto: CreateInventoryDto, @User() user: any) {
    return { message: 'Inventory item created', data: { ...createDto, id: `inv_${Date.now()}` } };
  }

  @Get()
  @Privileges('view_inventory')
  @Audit('View inventory items')
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiResponse({ status: 200, description: 'List of inventory items' })
  findAll(@User() user: any) {
    return { message: 'Inventory items retrieved', data: [] };
  }

  @Get(':id')
  @Privileges('view_inventory')
  @Audit('View inventory item details')
  @ApiOperation({ summary: 'Get inventory item by ID' })
  findOne(@Param('id') id: string, @User() user: any) {
    return { message: `Inventory item ${id} retrieved`, data: { id, itemName: 'Sample Item' } };
  }

  @Patch(':id')
  @Privileges('manage_inventory')
  @Audit('Update inventory item')
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiBody({ type: UpdateInventoryDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateInventoryDto, @User() user: any) {
    return { message: `Inventory item ${id} updated`, data: { id, ...updateDto } };
  }

  @Delete(':id')
  @Privileges('manage_inventory')
  @Audit('Delete inventory item')
  @ApiOperation({ summary: 'Delete inventory item' })
  remove(@Param('id') id: string, @User() user: any) {
    return { message: `Inventory item ${id} deleted`, data: { id, deleted: true } };
  }
}