import { Router } from 'express';
import { ItemsController } from '../controllers/items.controller';

const router = Router();

// GET /api/items
router.get('/', ItemsController.getAll);

// GET /api/items/:id
router.get('/:id', ItemsController.getById);

export default router;
