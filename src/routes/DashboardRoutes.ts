import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All dashboard routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Dashboard overview
router.get('/overview', DashboardController.getOverview);

// Analytics endpoints
router.get('/revenue', DashboardController.getRevenueAnalytics);
router.get('/users', DashboardController.getUserAnalytics);
router.get('/orders', DashboardController.getOrderAnalytics);
router.get('/geographic', DashboardController.getGeographicAnalytics);
router.get('/performance', DashboardController.getPerformanceMetrics);

export default router;
