import { Router } from 'express';
import { WorkerController } from '../controllers/WorkerController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateWorker } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', WorkerController.getAll);
router.get('/nearby', WorkerController.getNearby);
router.get('/stats/overview', authenticateToken, requireAdmin, WorkerController.getStats);
router.get('/:id', WorkerController.getById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireAdmin, validateWorker, WorkerController.create);
router.put('/:id', authenticateToken, requireAdmin, validateWorker, WorkerController.update);
router.delete('/:id', authenticateToken, requireAdmin, WorkerController.delete);
router.post('/:id/toggle-availability', authenticateToken, requireAdmin, WorkerController.toggleAvailability);
router.post('/:id/toggle-verification', authenticateToken, requireAdmin, WorkerController.toggleVerification);

export default router;
