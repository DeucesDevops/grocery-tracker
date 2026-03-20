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

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, shopId, budget } = req.body;
      const user = await prisma.user.findFirst();
      if (!user) throw new Error('No user found');

      const list = await prisma.shoppingList.create({
        data: {
          name,
          shopId,
          budget: budget ? parseFloat(budget) : null,
          userId: user.id,
          status: 'DRAFT'
        }
      });
      res.status(201).json(list);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, shopId, budget, status } = req.body;
      const list = await prisma.shoppingList.update({
        where: { id },
        data: {
          name,
          shopId,
          budget: budget ? parseFloat(budget) : undefined,
          status
        }
      });
      res.json(list);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.listItem.deleteMany({ where: { listId: id } });
      await prisma.shoppingList.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { itemId, qty } = req.body;
      const listItem = await prisma.listItem.create({
        data: {
          listId: id,
          itemId,
          qty: qty || 1
        }
      });
      res.status(201).json(listItem);
    } catch (error) {
      next(error);
    }
  }

  static async toggleItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { listItemId } = req.params;
      const { checked } = req.body;
      const listItem = await prisma.listItem.update({
        where: { id: listItemId },
        data: { checked }
      });
      res.json(listItem);
    } catch (error) {
      next(error);
    }
  }

  static async finishTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { totalSpent, notes } = req.body;
      
      const list = await prisma.shoppingList.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!list) return res.status(404).json({ error: 'List not found' });

      // Create expense
      const expense = await prisma.expense.create({
        data: {
          listId: id,
          userId: list.userId,
          totalSpent: parseFloat(totalSpent),
          notes
        }
      });

      // Mark list as completed
      await prisma.shoppingList.update({
        where: { id },
        data: { status: 'COMPLETED' }
      });

      res.status(201).json(expense);
    } catch (error) {
      next(error);
    }
  }
}
