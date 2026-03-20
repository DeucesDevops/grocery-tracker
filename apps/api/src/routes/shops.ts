import { Router } from 'express';
import { ShopsController } from '../controllers/shops.controller';

const router = Router();

// GET /api/shops
router.get('/', ShopsController.getAll);
router.post('/', ShopsController.create);
// GET /api/shops/:id
router.get('/:id', ShopsController.getById);

export default router;
