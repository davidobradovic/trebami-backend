import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateCategory } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', CategoryController.getAll);
router.get('/stats/overview', CategoryController.getStats);
router.get('/:id', CategoryController.getById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireAdmin, validateCategory, CategoryController.create);
router.put('/:id', authenticateToken, requireAdmin, validateCategory, CategoryController.update);
router.delete('/:id', authenticateToken, requireAdmin, CategoryController.delete);

export default router;
