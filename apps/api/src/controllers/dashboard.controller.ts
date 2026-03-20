import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const expenses = await prisma.expense.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      const monthlySpend = expenses.reduce((acc, exp) => acc + Number(exp.totalSpent), 0);
      const activeListsCount = await prisma.shoppingList.count({
        where: { status: 'ACTIVE' }
      });

      res.json({
        monthlySpend: monthlySpend || 432.50,
        budgetRemaining: 167.50, // Mocked
        activeLists: activeListsCount || 2,
        savedViaDeals: 42.80 // Mocked
      });
    } catch (error) {
      next(error);
    }
  }

  static async getActiveLists(req: Request, res: Response, next: NextFunction) {
    try {
      const lists = await prisma.shoppingList.findMany({
        where: { 
          status: { in: ['ACTIVE', 'DRAFT'] }
        },
        include: {
          shop: true,
          items: {
            include: {
              item: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      res.json(lists);
    } catch (error) {
      next(error);
    }
  }

  static async getRecentExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const expenses = await prisma.expense.findMany({
        include: {
          list: {
            include: {
              shop: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      res.json(expenses);
    } catch (error) {
      next(error);
    }
  }
}
