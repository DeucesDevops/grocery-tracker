export interface Item {
  id: string;
  userId: string;
  categoryId?: string | null;
  name: string;
  unit: string;
  notes?: string | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
