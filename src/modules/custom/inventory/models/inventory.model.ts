export interface Inventory {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  supplier?: string;
  expirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}