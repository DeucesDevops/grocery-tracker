import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';

export class ListsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const lists = await prisma.shoppingList.findMany({
        include: {
          shop: true,
          _count: {
            select: { items: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      res.json(lists);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const list = await prisma.shoppingList.findUnique({
        where: { id },
        include: {
          shop: true,
          items: {
            include: {
              item: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      });
      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }
      res.status(200).json(list);
    } catch (error) {
      next(error);
    }
  }
}
