import { Router } from 'express';
import { ListsController } from '../controllers/lists.controller';

const router = Router();

// GET /api/lists
router.get('/', ListsController.getAll);

// GET /api/lists/:id
router.get('/:id', ListsController.getById);

export default router;
