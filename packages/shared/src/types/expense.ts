export interface Expense {
  id: string;
  listId: string;
  userId: string;
  totalSpent: number;
  receiptUrl?: string | null;
  notes?: string | null;
  createdAt: Date;
}
