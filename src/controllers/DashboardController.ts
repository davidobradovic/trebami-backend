import { Request, Response } from 'express';
import { Category, Subcategory, User } from '../models';
import { Worker, Order, Message, Advertisement } from '../models';

export class DashboardController {
  // Get overall dashboard statistics
  static async getOverview(req: Request, res: Response): Promise<void> {
    try {
      // MySQL statistics
      const totalCategories = await Category.count();
      const totalSubcategories = await Subcategory.count();
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      const bannedUsers = await User.count({ where: { bannedAt: { [require('sequelize').Op.ne]: null } } });

      // MongoDB statistics
      const totalWorkers = await Worker.countDocuments();
      const availableWorkers = await Worker.countDocuments({ isAvailable: true });
      const verifiedWorkers = await Worker.countDocuments({ isVerified: true });
      
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: 'pending' });
      const inProgressOrders = await Order.countDocuments({ status: 'in-progress' });
      const completedOrders = await Order.countDocuments({ status: 'completed' });
      
      const totalMessages = await Message.countDocuments();
      const unreadMessages = await Message.countDocuments({ isRead: false });
      
      const totalAdvertisements = await Advertisement.countDocuments();
      const activeAdvertisements = await Advertisement.countDocuments({ isActive: true });

      // Revenue statistics
      const revenueStats = await Order.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            avgOrderValue: { $avg: '$totalPrice' },
            totalCompletedOrders: { $sum: 1 }
          }
        }
      ]);

      const totalRevenue = revenueStats[0]?.totalRevenue || 0;
      const avgOrderValue = revenueStats[0]?.avgOrderValue || 0;
      const totalCompletedOrders = revenueStats[0]?.totalCompletedOrders || 0;

      res.json({
        success: true,
        data: {
          categories: {
            total: totalCategories,
            subcategories: totalSubcategories
          },
          users: {
            total: totalUsers,
            active: activeUsers,
            banned: bannedUsers
          },
          workers: {
            total: totalWorkers,
            available: availableWorkers,
            verified: verifiedWorkers
          },
          orders: {
            total: totalOrders,
            pending: pendingOrders,
            inProgress: inProgressOrders,
            completed: totalCompletedOrders
          },
          messages: {
            total: totalMessages,
            unread: unreadMessages
          },
          advertisements: {
            total: totalAdvertisements,
            active: activeAdvertisements
          },
          revenue: {
            total: totalRevenue,
            average: avgOrderValue,
            completedOrders: totalCompletedOrders
          }
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get revenue analytics
  static async getRevenueAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { period = 'monthly', startDate, endDate } = req.query;

      let dateFilter: any = {};
      if (startDate && endDate) {
        dateFilter = {
          completedAt: {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string)
          }
        };
      }

      let groupBy: any = {};
      if (period === 'daily') {
        groupBy = {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' },
          day: { $dayOfMonth: '$completedAt' }
        };
      } else if (period === 'weekly') {
        groupBy = {
          year: { $year: '$completedAt' },
          week: { $week: '$completedAt' }
        };
      } else {
        // monthly
        groupBy = {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' }
        };
      }

      const revenueData = await Order.aggregate([
        { $match: { status: 'completed', ...dateFilter } },
        {
          $group: {
            _id: groupBy,
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 },
            avgOrderValue: { $avg: '$totalPrice' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1, '_id.week': -1 } }
      ]);

      // Revenue by category
      const revenueByCategory = await Order.aggregate([
        { $match: { status: 'completed', ...dateFilter } },
        {
          $group: {
            _id: '$categoryId',
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { revenue: -1 } }
      ]);

      // Payment method distribution
      const paymentMethodStats = await Order.aggregate([
        { $match: { status: 'completed', ...dateFilter } },
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      res.json({
        success: true,
        data: {
          revenueData,
          revenueByCategory,
          paymentMethodStats
        }
      });
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get user analytics
  static async getUserAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { period = 'monthly' } = req.query;

      let groupBy: any = {};
      if (period === 'daily') {
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
      } else {
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
      }

      // User registrations over time
      const userRegistrations = await User.findAll({
        attributes: [
          [require('sequelize').fn('YEAR', require('sequelize').col('createdAt')), 'year'],
          [require('sequelize').fn('MONTH', require('sequelize').col('createdAt')), 'month'],
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['year', 'month'],
        order: [['year', 'DESC'], ['month', 'DESC']]
      });

      // Users by role
      const usersByRole = await User.findAll({
        attributes: [
          'role',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['role']
      });

      // Worker registrations over time
      const workerRegistrations = await Worker.aggregate([
        {
          $group: {
            _id: groupBy,
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
      ]);

      // Workers by category
      const workersByCategory = await Worker.aggregate([
        {
          $group: {
            _id: '$categoryId',
            count: { $sum: 1 },
            avgRating: { $avg: '$ratings' },
            avgHourlyRate: { $avg: '$hourlyRate' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      res.json({
        success: true,
        data: {
          userRegistrations,
          usersByRole,
          workerRegistrations,
          workersByCategory
        }
      });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get order analytics
  static async getOrderAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { period = 'monthly', startDate, endDate } = req.query;

      let dateFilter: any = {};
      if (startDate && endDate) {
        dateFilter = {
          createdAt: {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string)
          }
        };
      }

      // Orders over time
      const ordersOverTime = await Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
      ]);

      // Orders by status
      const ordersByStatus = await Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Orders by category
      const ordersByCategory = await Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$categoryId',
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' },
            avgPrice: { $avg: '$totalPrice' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Orders by priority
      const ordersByPriority = await Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 },
            avgPrice: { $avg: '$totalPrice' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Average order completion time
      const avgCompletionTime = await Order.aggregate([
        { $match: { status: 'completed', completedAt: { $exists: true } } },
        {
          $addFields: {
            completionTime: {
              $divide: [
                { $subtract: ['$completedAt', '$createdAt'] },
                1000 * 60 * 60 // Convert to hours
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgCompletionTime: { $avg: '$completionTime' }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          ordersOverTime,
          ordersByStatus,
          ordersByCategory,
          ordersByPriority,
          avgCompletionTime: avgCompletionTime[0]?.avgCompletionTime || 0
        }
      });
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get geographic analytics
  static async getGeographicAnalytics(req: Request, res: Response): Promise<void> {
    try {
      // Workers by city
      const workersByCity = await Worker.aggregate([
        {
          $group: {
            _id: '$location.city',
            count: { $sum: 1 },
            avgRating: { $avg: '$ratings' },
            avgHourlyRate: { $avg: '$hourlyRate' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);

      // Orders by city
      const ordersByCity = await Order.aggregate([
        {
          $group: {
            _id: '$location.city',
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' },
            avgPrice: { $avg: '$totalPrice' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);

      // Top performing cities
      const topCities = await Order.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$location.city',
            orders: { $sum: 1 },
            revenue: { $sum: '$totalPrice' },
            avgRating: { $avg: '$rating' }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 }
      ]);

      res.json({
        success: true,
        data: {
          workersByCity,
          ordersByCity,
          topCities
        }
      });
    } catch (error) {
      console.error('Error fetching geographic analytics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get performance metrics
  static async getPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      // Worker performance
      const workerPerformance = await Worker.aggregate([
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$ratings' },
            avgHourlyRate: { $avg: '$hourlyRate' },
            totalJobs: { $sum: '$totalJobs' },
            completedJobs: { $sum: '$completedJobs' }
          }
        }
      ]);

      // Order completion rate
      const orderStats = await Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalOrders = orderStats.reduce((sum, stat) => sum + stat.count, 0);
      const completedOrders = orderStats.find(stat => stat._id === 'completed')?.count || 0;
      const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

      // Response time metrics
      const responseTimeMetrics = await Order.aggregate([
        { $match: { status: { $in: ['accepted', 'rejected'] } } },
        {
          $addFields: {
            responseTime: {
              $divide: [
                { $subtract: ['$updatedAt', '$createdAt'] },
                1000 * 60 // Convert to minutes
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: '$responseTime' },
            minResponseTime: { $min: '$responseTime' },
            maxResponseTime: { $max: '$responseTime' }
          }
        }
      ]);

      // Customer satisfaction
      const satisfactionMetrics = await Order.aggregate([
        { $match: { rating: { $exists: true, $gt: 0 } } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            totalRatings: { $sum: 1 },
            fiveStarRatings: {
              $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] }
            }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          workerPerformance: workerPerformance[0] || {},
          orderCompletionRate: completionRate,
          responseTimeMetrics: responseTimeMetrics[0] || {},
          satisfactionMetrics: satisfactionMetrics[0] || {}
        }
      });
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
