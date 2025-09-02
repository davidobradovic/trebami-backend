import { Router } from 'express';
import { SubcategoryController } from '../controllers/SubcategoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateSubcategory } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', SubcategoryController.getAll);
router.get('/stats/overview', SubcategoryController.getStats);
router.get('/category/:categoryId', SubcategoryController.getByCategoryId);
router.get('/:id', SubcategoryController.getById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireAdmin, validateSubcategory, SubcategoryController.create);
router.put('/:id', authenticateToken, requireAdmin, validateSubcategory, SubcategoryController.update);
router.delete('/:id', authenticateToken, requireAdmin, SubcategoryController.delete);

export default router;
