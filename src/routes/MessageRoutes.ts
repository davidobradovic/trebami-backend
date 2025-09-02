import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authenticateToken, requireUser } from '../middleware/auth';

const router = Router();

// Protected routes (authenticated users)
router.get('/', authenticateToken, requireUser, MessageController.getAll);
router.get('/stats/overview', authenticateToken, requireUser, MessageController.getStats);
router.get('/order/:orderId', authenticateToken, requireUser, MessageController.getByOrder);
router.get('/user/:userId/unread-count', authenticateToken, requireUser, MessageController.getUnreadCount);
router.get('/conversation', authenticateToken, requireUser, MessageController.getConversation);
router.get('/:id', authenticateToken, requireUser, MessageController.getById);
router.post('/', authenticateToken, requireUser, MessageController.create);
router.put('/:id', authenticateToken, requireUser, MessageController.update);
router.delete('/:id', authenticateToken, requireUser, MessageController.delete);
router.post('/:id/read', authenticateToken, requireUser, MessageController.markAsRead);
router.post('/read-all', authenticateToken, requireUser, MessageController.markAllAsRead);

export default router;
