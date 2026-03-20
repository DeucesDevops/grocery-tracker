import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';

export class ItemsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await prisma.item.findMany({
        where: { deletedAt: null },
        include: { category: true }
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const item = await prisma.item.findUnique({
        where: { id },
        include: { category: true }
      });
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, unit, categoryId, notes } = req.body;
      const user = await prisma.user.findFirst();
      if (!user) throw new Error('No user found');

      const item = await prisma.item.create({
        data: {
          name,
          unit: unit || 'each',
          categoryId: categoryId || null,
          notes,
          userId: user.id
        }
      });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }
}
