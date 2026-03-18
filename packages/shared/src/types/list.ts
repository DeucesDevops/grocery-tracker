export enum ShoppingListStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface ShoppingList {
  id: string;
  userId: string;
  shopId?: string | null;
  name: string;
  budget?: number | null;
  status: ShoppingListStatus;
  date?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListItem {
  id: string;
  listId: string;
  itemId: string;
  qty: number;
  estPrice?: number | null;
  actualPrice?: number | null;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
