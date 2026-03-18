export interface Shop {
  id: string;
  userId: string;
  name: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  category?: string | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
