import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserController {
  // Get all users with optional filtering
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, role, isActive } = req.query;
      
      const whereClause: any = {};
      if (search) {
        whereClause[require('sequelize').Op.or] = [
          { fullName: { [require('sequelize').Op.like]: `%${search}%` } },
          { email: { [require('sequelize').Op.like]: `%${search}%` } }
        ];
      }
      if (role) {
        whereClause.role = role;
      }
      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const offset = (Number(page) - 1) * Number(limit);
      
      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          pages: Math.ceil(count / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get single user by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const user = await User.findByPk(Number(id), {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Create new user
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, password, role, phoneNumber, profileImage } = req.body;

      // Check if user with same email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ 
          success: false, 
          message: 'User with this email already exists' 
        });
        return;
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: role || 'user',
        phoneNumber,
        profileImage,
        isActive: true,
        createdAt: new Date()
      });

      // Remove password from response
      const userResponse = user.toJSON();
      (userResponse as any).password = undefined;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userResponse
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Update user
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { fullName, email, password, role, phoneNumber, profileImage, isActive } = req.body;

      const user = await User.findByPk(Number(id));
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }

      // Check if email is being changed and if it conflicts with existing user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          res.status(400).json({ 
            success: false, 
            message: 'User with this email already exists' 
          });
          return;
        }
      }

      const updateData: any = {
        fullName: fullName !== undefined ? fullName : user.fullName,
        email: email !== undefined ? email : user.email,
        role: role !== undefined ? role : user.role,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : user.phoneNumber,
        profileImage: profileImage !== undefined ? profileImage : user.profileImage,
        isActive: isActive !== undefined ? isActive : user.isActive
      };

      // Hash password if it's being updated
      if (password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      await user.update(updateData);

      // Remove password from response
      const userResponse = user.toJSON();
      (userResponse as any).password = undefined;

      res.json({
        success: true,
        message: 'User updated successfully',
        data: userResponse
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Delete user
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByPk(Number(id));
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }

      // Check if user is admin and trying to delete themselves
      if (user.role === 'admin' && Number(id) === (req as any).user?.id) {
        res.status(400).json({ 
          success: false, 
          message: 'Cannot delete your own admin account' 
        });
        return;
      }

      await user.destroy();

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // User login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(401).json({ 
          success: false, 
          message: 'Account is deactivated' 
        });
        return;
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password || '');
      if (!isValidPassword) {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
      );

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      // Remove password from response
      const userResponse = user.toJSON();
      (userResponse as any).password = undefined;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Change password
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(Number(id));
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password || '');
      if (!isValidPassword) {
        res.status(400).json({ 
          success: false, 
          message: 'Current password is incorrect' 
        });
        return;
      }

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await user.update({ password: hashedPassword });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Ban/Unban user
  static async toggleBan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { banReason, bannedBy } = req.body;

      const user = await User.findByPk(Number(id));
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }

      if (user.bannedAt) {
        // Unban user
        await user.update({
          bannedAt: null,
          banReason: null,
          bannedBy: null
        });

        res.json({
          success: true,
          message: 'User unbanned successfully'
        });
      } else {
        // Ban user
        await user.update({
          bannedAt: new Date(),
          banReason,
          bannedBy
        });

        res.json({
          success: true,
          message: 'User banned successfully'
        });
      }
    } catch (error) {
      console.error('Error toggling user ban:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get user statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      const inactiveUsers = await User.count({ where: { isActive: false } });
      const bannedUsers = await User.count({ where: { bannedAt: { [require('sequelize').Op.ne]: null } } });

      // Users by role
      const usersByRole = await User.findAll({
        attributes: [
          'role',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['role']
      });

      // Recent registrations
      const recentRegistrations = await User.findAll({
        where: {
          createdAt: {
            [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        attributes: ['id', 'fullName', 'email', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          banned: bannedUsers,
          byRole: usersByRole,
          recentRegistrations
        }
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
