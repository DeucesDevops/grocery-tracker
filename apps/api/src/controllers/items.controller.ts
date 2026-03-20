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
}
