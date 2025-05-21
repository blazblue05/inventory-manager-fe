import { User } from './user.model';
import { Item } from './item.model';

export type TransactionType = 'purchase' | 'sale' | 'adjustment' | 'transfer';

export interface Transaction {
  id?: number;
  type: TransactionType;
  itemId: number;
  item?: Item;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  userId: number;
  user?: User;
  notes?: string;
  referenceNumber?: string;
  transactionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}