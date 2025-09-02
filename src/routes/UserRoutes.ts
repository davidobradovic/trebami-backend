import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireAdmin, requireUser } from '../middleware/auth';
import { validateUser } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/login', UserController.login);

// Protected routes
router.get('/', UserController.getAll);
router.get('/stats/overview', authenticateToken, requireAdmin, UserController.getStats);
router.get('/:id', authenticateToken, requireUser, UserController.getById);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, validateUser, UserController.create);
router.put('/:id', authenticateToken, requireAdmin, validateUser, UserController.update);
router.delete('/:id', authenticateToken, requireAdmin, UserController.delete);
router.post('/:id/ban', authenticateToken, requireAdmin, UserController.toggleBan);

// User routes (can change own password)
router.post('/:id/change-password', authenticateToken, requireUser, UserController.changePassword);

export default router;
