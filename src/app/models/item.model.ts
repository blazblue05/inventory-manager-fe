import { Category } from './category.model';

export interface Item {
  id?: number;
  name: string;
  description?: string;
  sku: string;
  categoryId: number;
  category?: Category;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}