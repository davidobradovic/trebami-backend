import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken, requireAdmin, requireUser } from '../middleware/auth';
import { validateOrder } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', OrderController.getAll);
router.get('/number/:orderNumber', OrderController.getByOrderNumber);
router.get('/stats/overview', authenticateToken, requireAdmin, OrderController.getStats);
router.get('/customer/:customerId', authenticateToken, requireUser, OrderController.getByCustomer);
router.get('/worker/:workerId', authenticateToken, requireUser, OrderController.getByWorker);
router.get('/:id', OrderController.getById);

// Protected routes
router.post('/', authenticateToken, requireUser, validateOrder, OrderController.create);
router.put('/:id', authenticateToken, requireUser, validateOrder, OrderController.update);
router.delete('/:id', authenticateToken, requireAdmin, OrderController.delete);
router.post('/:id/status', authenticateToken, requireUser, OrderController.updateStatus);

export default router;
