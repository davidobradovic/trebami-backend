import { Request, Response } from 'express';
import { Worker } from '../models';

export class WorkerController {
  // Get all workers with optional filtering
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, categoryId, subcategoryId, isAvailable, isVerified } = req.query;
      
      const filter: any = {};
      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { 'location.city': { $regex: search, $options: 'i' } }
        ];
      }
      if (categoryId) {
        filter.categoryId = Number(categoryId);
      }
      if (subcategoryId) {
        filter.subcategoryId = Number(subcategoryId);
      }
      if (isAvailable !== undefined) {
        filter.isAvailable = isAvailable === 'true';
      }
      if (isVerified !== undefined) {
        filter.isVerified = isVerified === 'true';
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const workers = await Worker.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Worker.countDocuments(filter);

      res.json({
        success: true,
        data: workers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching workers:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get single worker by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const worker = await Worker.findById(id);
      if (!worker) {
        res.status(404).json({ 
          success: false, 
          message: 'Worker not found' 
        });
        return;
      }

      res.json({
        success: true,
        data: worker
      });
    } catch (error) {
      console.error('Error fetching worker:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Create new worker
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const workerData = req.body;

      // Check if worker with same email already exists
      const existingWorker = await Worker.findOne({ email: workerData.email });
      if (existingWorker) {
        res.status(400).json({ 
          success: false, 
          message: 'Worker with this email already exists' 
        });
        return;
      }

      const worker = await Worker.create(workerData);

      res.status(201).json({
        success: true,
        message: 'Worker created successfully',
        data: worker
      });
    } catch (error) {
      console.error('Error creating worker:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Update worker
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const worker = await Worker.findById(id);
      if (!worker) {
        res.status(404).json({ 
          success: false, 
          message: 'Worker not found' 
        });
        return;
      }

      // Check if email is being changed and if it conflicts with existing worker
      if (updateData.email && updateData.email !== worker.email) {
        const existingWorker = await Worker.findOne({ 
          email: updateData.email,
          _id: { $ne: id }
        });
        if (existingWorker) {
          res.status(400).json({ 
            success: false, 
            message: 'Worker with this email already exists' 
          });
          return;
        }
      }

      const updatedWorker = await Worker.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Worker updated successfully',
        data: updatedWorker
      });
    } catch (error) {
      console.error('Error updating worker:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Delete worker
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const worker = await Worker.findById(id);
      if (!worker) {
        res.status(404).json({ 
          success: false, 
          message: 'Worker not found' 
        });
        return;
      }

      await Worker.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Worker deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting worker:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Toggle worker availability
  static async toggleAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const worker = await Worker.findById(id);
      if (!worker) {
        res.status(404).json({ 
          success: false, 
          message: 'Worker not found' 
        });
        return;
      }

      worker.isAvailable = !worker.isAvailable;
      await worker.save();

      res.json({
        success: true,
        message: `Worker ${worker.isAvailable ? 'made available' : 'made unavailable'} successfully`,
        data: { isAvailable: worker.isAvailable }
      });
    } catch (error) {
      console.error('Error toggling worker availability:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Toggle worker verification
  static async toggleVerification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const worker = await Worker.findById(id);
      if (!worker) {
        res.status(404).json({ 
          success: false, 
          message: 'Worker not found' 
        });
        return;
      }

      worker.isVerified = !worker.isVerified;
      await worker.save();

      res.json({
        success: true,
        message: `Worker ${worker.isVerified ? 'verified' : 'unverified'} successfully`,
        data: { isVerified: worker.isVerified }
      });
    } catch (error) {
      console.error('Error toggling worker verification:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get workers by location (nearby search)
  static async getNearby(req: Request, res: Response): Promise<void> {
    try {
      const { longitude, latitude, maxDistance = 10000, limit = 20 } = req.query;

      if (!longitude || !latitude) {
        res.status(400).json({ 
          success: false, 
          message: 'Longitude and latitude are required' 
        });
        return;
      }

      const workers = await Worker.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [Number(longitude), Number(latitude)]
            },
            $maxDistance: Number(maxDistance)
          }
        },
        isAvailable: true,
        isVerified: true
      })
      .limit(Number(limit))
      .select('fullName email location ratings hourlyRate skills');

      res.json({
        success: true,
        data: workers
      });
    } catch (error) {
      console.error('Error fetching nearby workers:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get worker statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const totalWorkers = await Worker.countDocuments();
      const availableWorkers = await Worker.countDocuments({ isAvailable: true });
      const verifiedWorkers = await Worker.countDocuments({ isVerified: true });
      const activeWorkers = await Worker.countDocuments({ 
        $and: [
          { isAvailable: true },
          { isVerified: true }
        ]
      });

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

      // Top rated workers
      const topRatedWorkers = await Worker.find({ ratings: { $gt: 0 } })
        .sort({ ratings: -1 })
        .limit(10)
        .select('fullName ratings hourlyRate skills');

      // Recent registrations
      const recentRegistrations = await Worker.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('fullName email createdAt isVerified');

      res.json({
        success: true,
        data: {
          total: totalWorkers,
          available: availableWorkers,
          verified: verifiedWorkers,
          active: activeWorkers,
          byCategory: workersByCategory,
          topRated: topRatedWorkers,
          recentRegistrations
        }
      });
    } catch (error) {
      console.error('Error fetching worker stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
