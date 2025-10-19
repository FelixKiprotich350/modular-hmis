import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';

export interface StockMovement {
  id: string;
  itemId: string;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
  userId: string;
  createdAt: Date;
}

@Injectable()
export class InventoryService {
  constructor(private db: PrismaClient) {}

  async createItem(data: CreateInventoryDto): Promise<any> {
    return await this.db.inventory.create({
      data
    });
  }

  async getItem(id: string): Promise<any> {
    return await this.db.inventory.findUnique({
      where: { id }
    });
  }

  async searchItems(query: string): Promise<any[]> {
    return await this.db.inventory.findMany({
      where: {
        OR: [
          { itemName: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } }
        ]
      }
    });
  }

  async getItemsByCategory(category: string): Promise<any[]> {
    return await this.db.inventory.findMany({
      where: { category },
      orderBy: { itemName: 'asc' }
    });
  }

  async adjustStock(itemId: string, quantity: number, movementType: 'IN' | 'OUT' | 'ADJUSTMENT', reason?: string, userId?: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const item = await tx.inventory.findUnique({
        where: { id: itemId }
      });

      if (!item) {
        throw new Error('Inventory item not found');
      }

      let newQuantity = item.quantity;
      if (movementType === 'IN') {
        newQuantity += quantity;
      } else if (movementType === 'OUT') {
        if (item.quantity < quantity) {
          throw new Error('Insufficient stock');
        }
        newQuantity -= quantity;
      } else {
        newQuantity = quantity;
      }

      const updatedItem = await tx.inventory.update({
        where: { id: itemId },
        data: { quantity: newQuantity }
      });

      return updatedItem;
    });
  }

  async getLowStockItems(): Promise<any[]> {
    return await this.db.inventory.findMany({
      where: {
        quantity: {
          lte: this.db.inventory.fields.quantity
        }
      },
      orderBy: { quantity: 'asc' }
    });
  }

  async getExpiringItems(days: number = 30): Promise<any[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.db.inventory.findMany({
      where: {
        expirationDate: {
          lte: futureDate,
          gte: new Date()
        }
      },
      orderBy: { expirationDate: 'asc' }
    });
  }

  async transferStock(fromItemId: string, toItemId: string, quantity: number, userId: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const fromItem = await tx.inventory.findUnique({
        where: { id: fromItemId }
      });

      if (!fromItem || fromItem.quantity < quantity) {
        throw new Error('Insufficient stock for transfer');
      }

      await tx.inventory.update({
        where: { id: fromItemId },
        data: { quantity: fromItem.quantity - quantity }
      });

      const toItem = await tx.inventory.findUnique({
        where: { id: toItemId }
      });

      if (!toItem) {
        throw new Error('Destination item not found');
      }

      await tx.inventory.update({
        where: { id: toItemId },
        data: { quantity: toItem.quantity + quantity }
      });

      return { success: true, transferred: quantity };
    });
  }

  async generateStockReport(category?: string): Promise<any> {
    const where = category ? { category } : {};
    
    const items = await this.db.inventory.findMany({
      where,
      orderBy: { category: 'asc' }
    });

    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalItems = items.length;
    const lowStockCount = items.filter(item => item.quantity <= 10).length;

    return {
      items,
      summary: {
        totalItems,
        totalValue,
        lowStockCount,
        categories: [...new Set(items.map(item => item.category))]
      },
      generatedAt: new Date()
    };
  }

  async listItems(): Promise<any[]> {
    return await this.db.inventory.findMany({
      orderBy: { itemName: 'asc' }
    });
  }

  async updateItem(id: string, data: UpdateInventoryDto): Promise<any> {
    return await this.db.inventory.update({
      where: { id },
      data
    });
  }

  async deleteItem(id: string): Promise<boolean> {
    await this.db.inventory.delete({ where: { id } });
    return true;
  }
}