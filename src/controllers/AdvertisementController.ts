import { Request, Response } from 'express';
import { Advertisement } from '../models';

export class AdvertisementController {
  // Get all advertisements with optional filtering
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, isActive, targetAudience, categoryId } = req.query;
      
      const filter: any = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }
      if (targetAudience) {
        filter.targetAudience = targetAudience;
      }
      if (categoryId) {
        filter.targetCategoryId = Number(categoryId);
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const advertisements = await Advertisement.find(filter)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Advertisement.countDocuments(filter);

      res.json({
        success: true,
        data: advertisements,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get active advertisements for public display
  static async getActive(req: Request, res: Response): Promise<void> {
    try {
      const { targetAudience, categoryId, limit = 10 } = req.query;
      
      const filter: any = {
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      };

      if (targetAudience) {
        filter.targetAudience = targetAudience;
      }
      if (categoryId) {
        filter.targetCategoryId = Number(categoryId);
      }

      const advertisements = await Advertisement.find(filter)
        .sort({ priority: -1, createdAt: -1 })
        .limit(Number(limit));

      res.json({
        success: true,
        data: advertisements
      });
    } catch (error) {
      console.error('Error fetching active advertisements:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get single advertisement by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const advertisement = await Advertisement.findById(id);
      if (!advertisement) {
        res.status(404).json({ 
          success: false, 
          message: 'Advertisement not found' 
        });
        return;
      }

      res.json({
        success: true,
        data: advertisement
      });
    } catch (error) {
      console.error('Error fetching advertisement:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Create new advertisement
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const advertisementData = req.body;

      const advertisement = await Advertisement.create(advertisementData);

      res.status(201).json({
        success: true,
        message: 'Advertisement created successfully',
        data: advertisement
      });
    } catch (error) {
      console.error('Error creating advertisement:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Update advertisement
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const advertisement = await Advertisement.findById(id);
      if (!advertisement) {
        res.status(404).json({ 
          success: false, 
          message: 'Advertisement not found' 
        });
        return;
      }

      const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Advertisement updated successfully',
        data: updatedAdvertisement
      });
    } catch (error) {
      console.error('Error updating advertisement:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Delete advertisement
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const advertisement = await Advertisement.findById(id);
      if (!advertisement) {
        res.status(404).json({ 
          success: false, 
          message: 'Advertisement not found' 
        });
        return;
      }

      await Advertisement.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Advertisement deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Toggle advertisement status
  static async toggleStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const advertisement = await Advertisement.findById(id);
      if (!advertisement) {
        res.status(404).json({ 
          success: false, 
          message: 'Advertisement not found' 
        });
        return;
      }

      advertisement.isActive = !advertisement.isActive;
      await advertisement.save();

      res.json({
        success: true,
        message: `Advertisement ${advertisement.isActive ? 'activated' : 'deactivated'} successfully`,
        data: { isActive: advertisement.isActive }
      });
    } catch (error) {
      console.error('Error toggling advertisement status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Record advertisement impression
  static async recordImpression(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const advertisement = await Advertisement.findById(id);
      if (!advertisement) {
        res.status(404).json({ 
          success: false, 
          message: 'Advertisement not found' 
        });
        return;
      }

      advertisement.impressions += 1;
      await advertisement.save();

      res.json({
        success: true,
        message: 'Impression recorded successfully',
        data: { impressions: advertisement.impressions }
      });
    } catch (error) {
      console.error('Error recording impression:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Record advertisement click
  static async recordClick(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const advertisement = await Advertisement.findById(id);
      if (!advertisement) {
        res.status(404).json({ 
          success: false, 
          message: 'Advertisement not found' 
        });
        return;
      }

      advertisement.clicks += 1;
      await advertisement.save();

      res.json({
        success: true,
        message: 'Click recorded successfully',
        data: { clicks: advertisement.clicks }
      });
    } catch (error) {
      console.error('Error recording click:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get advertisement statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const totalAdvertisements = await Advertisement.countDocuments();
      const activeAdvertisements = await Advertisement.countDocuments({ isActive: true });
      const inactiveAdvertisements = await Advertisement.countDocuments({ isActive: false });

      // Advertisements by target audience
      const byTargetAudience = await Advertisement.aggregate([
        {
          $group: {
            _id: '$targetAudience',
            count: { $sum: 1 },
            totalClicks: { $sum: '$clicks' },
            totalImpressions: { $sum: '$impressions' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Advertisements by category
      const byCategory = await Advertisement.aggregate([
        {
          $group: {
            _id: '$targetCategoryId',
            count: { $sum: 1 },
            totalClicks: { $sum: '$clicks' },
            totalImpressions: { $sum: '$impressions' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Top performing advertisements
      const topPerformers = await Advertisement.find()
        .sort({ clicks: -1 })
        .limit(10)
        .select('title clicks impressions priority');

      // Click-through rate statistics
      const ctrStats = await Advertisement.aggregate([
        {
          $addFields: {
            ctr: {
              $cond: [
                { $gt: ['$impressions', 0] },
                { $multiply: [{ $divide: ['$clicks', '$impressions'] }, 100] },
                0
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgCTR: { $avg: '$ctr' },
            totalClicks: { $sum: '$clicks' },
            totalImpressions: { $sum: '$impressions' }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          total: totalAdvertisements,
          active: activeAdvertisements,
          inactive: inactiveAdvertisements,
          byTargetAudience,
          byCategory,
          topPerformers,
          ctrStats: ctrStats[0] || {}
        }
      });
    } catch (error) {
      console.error('Error fetching advertisement stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
