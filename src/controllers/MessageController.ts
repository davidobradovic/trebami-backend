import { Request, Response } from 'express';
import { Message } from '../models';

export class MessageController {
  // Get all messages with optional filtering
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, orderId, senderId, receiverId, isRead } = req.query;
      
      const filter: any = {};
      if (orderId) {
        filter.orderId = orderId;
      }
      if (senderId) {
        filter.senderId = Number(senderId);
      }
      if (receiverId) {
        filter.receiverId = Number(receiverId);
      }
      if (isRead !== undefined) {
        filter.isRead = isRead === 'true';
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const messages = await Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Message.countDocuments(filter);

      res.json({
        success: true,
        data: messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get messages by order ID
  static async getByOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      
      const messages = await Message.find({ orderId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Message.countDocuments({ orderId });

      res.json({
        success: true,
        data: messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching order messages:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get conversation between two users
  static async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { userId1, userId2, orderId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const filter: any = {
        orderId,
        $or: [
          { senderId: Number(userId1), receiverId: Number(userId2) },
          { senderId: Number(userId2), receiverId: Number(userId1) }
        ]
      };

      const skip = (Number(page) - 1) * Number(limit);
      
      const messages = await Message.find(filter)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Message.countDocuments(filter);

      res.json({
        success: true,
        data: messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get single message by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const message = await Message.findById(id);
      if (!message) {
        res.status(404).json({ 
          success: false, 
          message: 'Message not found' 
        });
        return;
      }

      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error fetching message:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Create new message
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const messageData = req.body;

      const message = await Message.create(messageData);

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Update message
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const message = await Message.findById(id);
      if (!message) {
        res.status(404).json({ 
          success: false, 
          message: 'Message not found' 
        });
        return;
      }

      const updatedMessage = await Message.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Message updated successfully',
        data: updatedMessage
      });
    } catch (error) {
      console.error('Error updating message:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Delete message
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const message = await Message.findById(id);
      if (!message) {
        res.status(404).json({ 
          success: false, 
          message: 'Message not found' 
        });
        return;
      }

      await Message.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Mark message as read
  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const message = await Message.findById(id);
      if (!message) {
        res.status(404).json({ 
          success: false, 
          message: 'Message not found' 
        });
        return;
      }

      message.isRead = true;
      message.readAt = new Date();
      await message.save();

      res.json({
        success: true,
        message: 'Message marked as read',
        data: message
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Mark all messages as read for a user in an order
  static async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, userId } = req.params;

      const result = await Message.updateMany(
        { 
          orderId, 
          receiverId: Number(userId),
          isRead: false
        },
        { 
          isRead: true, 
          readAt: new Date() 
        }
      );

      res.json({
        success: true,
        message: `${result.modifiedCount} messages marked as read`,
        data: { modifiedCount: result.modifiedCount }
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get unread message count for a user
  static async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const count = await Message.countDocuments({
        receiverId: Number(userId),
        isRead: false
      });

      res.json({
        success: true,
        data: { unreadCount: count }
      });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get message statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const totalMessages = await Message.countDocuments();
      const readMessages = await Message.countDocuments({ isRead: true });
      const unreadMessages = await Message.countDocuments({ isRead: false });

      // Messages by type
      const messagesByType = await Message.aggregate([
        {
          $group: {
            _id: '$messageType',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Messages by order
      const messagesByOrder = await Message.aggregate([
        {
          $group: {
            _id: '$orderId',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Recent messages
      const recentMessages = await Message.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('content senderId receiverId orderId createdAt');

      res.json({
        success: true,
        data: {
          total: totalMessages,
          read: readMessages,
          unread: unreadMessages,
          byType: messagesByType,
          byOrder: messagesByOrder,
          recentMessages
        }
      });
    } catch (error) {
      console.error('Error fetching message stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
