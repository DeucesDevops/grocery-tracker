import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();

// GET /api/dashboard/summary
router.get('/summary', DashboardController.getSummary);

// GET /api/dashboard/active-lists
router.get('/active-lists', DashboardController.getActiveLists);

// GET /api/dashboard/recent-expenses
router.get('/recent-expenses', DashboardController.getRecentExpenses);

export default router;
