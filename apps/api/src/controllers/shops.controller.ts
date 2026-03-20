import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';

export class ShopsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const shops = await prisma.shop.findMany({
        where: { deletedAt: null }
      });
      res.json(shops);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const shop = await prisma.shop.findUnique({
        where: { id }
      });
      if (!shop) {
        return res.status(404).json({ error: 'Shop not found' });
      }
      res.json(shop);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, address, category } = req.body;
      const user = await prisma.user.findFirst();
      if (!user) throw new Error('No user found');

      const shop = await prisma.shop.create({
        data: {
          name,
          address,
          category,
          userId: user.id
        }
      });
      res.status(201).json(shop);
    } catch (error) {
      next(error);
    }
  }
}
