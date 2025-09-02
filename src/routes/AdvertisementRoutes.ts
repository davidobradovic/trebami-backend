import { Router } from 'express';
import { AdvertisementController } from '../controllers/AdvertisementController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateAdvertisement } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/active', AdvertisementController.getActive);
router.post('/:id/impression', AdvertisementController.recordImpression);
router.post('/:id/click', AdvertisementController.recordClick);

// Protected routes (admin only)
router.get('/', authenticateToken, requireAdmin, AdvertisementController.getAll);
router.get('/stats/overview', authenticateToken, requireAdmin, AdvertisementController.getStats);
router.get('/:id', authenticateToken, requireAdmin, AdvertisementController.getById);
router.post('/', authenticateToken, requireAdmin, validateAdvertisement, AdvertisementController.create);
router.put('/:id', authenticateToken, requireAdmin, validateAdvertisement, AdvertisementController.update);
router.delete('/:id', authenticateToken, requireAdmin, AdvertisementController.delete);
router.post('/:id/toggle-status', authenticateToken, requireAdmin, AdvertisementController.toggleStatus);

export default router;
