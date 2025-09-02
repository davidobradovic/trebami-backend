import { Request, Response } from 'express';
import { Order } from '../models';
import { OrderNumberGenerator } from '../utils/orderNumberGenerator';

export class OrderController {
  // Get all orders with optional filtering
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, status, customerId, workerId, categoryId, subcategoryId, startDate, endDate } = req.query;
      
      const filter: any = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { orderNumber: { $regex: search, $options: 'i' } }
        ];
      }
      if (status) {
        filter.status = status;
      }
      if (customerId) {
        filter.customerId = Number(customerId);
      }
      if (workerId) {
        filter.workerId = workerId;
      }
      if (categoryId) {
        filter.categoryId = Number(categoryId);
      }
      if (subcategoryId) {
        filter.subcategoryId = Number(subcategoryId);
      }
      if (startDate && endDate) {
        filter.scheduledDate = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        };
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Order.countDocuments(filter);

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get single order by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const order = await Order.findById(id);
      if (!order) {
        res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
        return;
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get order by order number
  static async getByOrderNumber(req: Request, res: Response): Promise<void> {
    try {
      const { orderNumber } = req.params;
      
      const order = await Order.findOne({ orderNumber });
      if (!order) {
        res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
        return;
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error fetching order by number:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Create new order
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const orderData = req.body;

      // Generate unique order number
      orderData.orderNumber = await OrderNumberGenerator.generate();

      const order = await Order.create(orderData);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Update order
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const order = await Order.findById(id);
      if (!order) {
        res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
        return;
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Delete order
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
        return;
      }

      // Check if order can be deleted (only pending orders)
      if (order.status !== 'pending') {
        res.status(400).json({ 
          success: false, 
          message: 'Only pending orders can be deleted' 
        });
        return;
      }

      await Order.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Update order status
  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const order = await Order.findById(id);
      if (!order) {
        res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
        return;
      }

      // Validate status transition
      const validTransitions: { [key: string]: string[] } = {
        'pending': ['accepted', 'rejected'],
        'accepted': ['in-progress'],
        'in-progress': ['completed', 'cancelled'],
        'completed': [],
        'cancelled': [],
        'rejected': []
      };

      if (!validTransitions[order.status].includes(status)) {
        res.status(400).json({ 
          success: false, 
          message: `Invalid status transition from ${order.status} to ${status}` 
        });
        return;
      }

      const updateData: any = { status };
      
      // Add timestamps for certain status changes
      if (status === 'completed') {
        updateData.completedAt = new Date();
      } else if (status === 'cancelled') {
        updateData.cancelledAt = new Date();
      }

      // Add notes if provided
      if (notes) {
        if ((req as any).user?.role === 'worker') {
          updateData.workerNotes = notes;
        } else {
          updateData.customerNotes = notes;
        }
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      res.json({
        success: true,
        message: `Order status updated to ${status} successfully`,
        data: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get orders by customer
  static async getByCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      const filter: any = { customerId: Number(customerId) };
      if (status) {
        filter.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Order.countDocuments(filter);

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get orders by worker
  static async getByWorker(req: Request, res: Response): Promise<void> {
    try {
      const { workerId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      const filter: any = { workerId };
      if (status) {
        filter.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Order.countDocuments(filter);

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching worker orders:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get order statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: 'pending' });
      const inProgressOrders = await Order.countDocuments({ status: 'in-progress' });
      const completedOrders = await Order.countDocuments({ status: 'completed' });
      const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

      // Orders by status
      const ordersByStatus = await Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Orders by category
      const ordersByCategory = await Order.aggregate([
        {
          $group: {
            _id: '$categoryId',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' },
            avgPrice: { $avg: '$totalPrice' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Recent orders
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderNumber title status totalPrice createdAt');

      // Revenue statistics
      const totalRevenue = await Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]);

      const monthlyRevenue = await Order.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: {
              year: { $year: '$completedAt' },
              month: { $month: '$completedAt' }
            },
            revenue: { $sum: '$totalPrice' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]);

      res.json({
        success: true,
        data: {
          total: totalOrders,
          pending: pendingOrders,
          inProgress: inProgressOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          byStatus: ordersByStatus,
          byCategory: ordersByCategory,
          recentOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyRevenue
        }
      });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
