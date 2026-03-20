import { Router } from 'express';
import { ListsController } from '../controllers/lists.controller';

const router = Router();

// GET /api/lists
router.get('/', ListsController.getAll);
router.post('/', ListsController.create);

// GET /api/lists/:id
router.get('/:id', ListsController.getById);
router.patch('/:id', ListsController.update);
router.delete('/:id', ListsController.delete);
router.post('/:id/items', ListsController.addItem);
router.patch('/items/:listItemId', ListsController.toggleItem);
router.post('/:id/finish', ListsController.finishTrip);

export default router;
