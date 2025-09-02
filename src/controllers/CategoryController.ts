import { Request, Response } from 'express';
import { Category, Subcategory } from '../models';

export class CategoryController {
  // Get all categories with optional filtering
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, isActive } = req.query;
      
      const whereClause: any = {};
      if (search) {
        whereClause.title = { [require('sequelize').Op.like]: `%${search}%` };
      }
      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const offset = (Number(page) - 1) * Number(limit);
      
      const { count, rows } = await Category.findAndCountAll({
        where: whereClause,
        include: [{
          model: Subcategory,
          as: 'subcategories',
          attributes: ['id', 'title', 'isActive']
        }],
        limit: Number(limit),
        offset,
        order: [['title', 'ASC']]
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
      console.error('Error fetching categories:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get single category by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(Number(id), {
        include: [{
          model: Subcategory,
          as: 'subcategories',
          attributes: ['id', 'title', 'description', 'icon', 'isActive', 'createdAt']
        }]
      });

      if (!category) {
        res.status(404).json({ 
          success: false, 
          message: 'Category not found' 
        });
        return;
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Create new category
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, icon, description, color, createdBy } = req.body;

      // Check if category with same title already exists
      const existingCategory = await Category.findOne({ where: { title } });
      if (existingCategory) {
        res.status(400).json({ 
          success: false, 
          message: 'Category with this title already exists' 
        });
        return;
      }

      const category = await Category.create({
        title,
        icon,
        description,
        color,
        createdBy,
        isActive: true,
        createdAt: new Date()
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Update category
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, icon, description, color, isActive } = req.body;

      const category = await Category.findByPk(Number(id));
      if (!category) {
        res.status(404).json({ 
          success: false, 
          message: 'Category not found' 
        });
        return;
      }

      // Check if title is being changed and if it conflicts with existing category
      if (title && title !== category.title) {
        const existingCategory = await Category.findOne({ where: { title } });
        if (existingCategory) {
          res.status(400).json({ 
            success: false, 
            message: 'Category with this title already exists' 
          });
          return;
        }
      }

      await category.update({
        title: title || category.title,
        icon: icon !== undefined ? icon : category.icon,
        description: description !== undefined ? description : category.description,
        color: color !== undefined ? color : category.color,
        isActive: isActive !== undefined ? isActive : category.isActive
      });

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Delete category
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(Number(id));
      if (!category) {
        res.status(404).json({ 
          success: false, 
          message: 'Category not found' 
        });
        return;
      }

      // Check if category has subcategories
      const subcategoryCount = await Subcategory.count({ where: { categoryId: Number(id) } });
      if (subcategoryCount > 0) {
        res.status(400).json({ 
          success: false, 
          message: 'Cannot delete category with existing subcategories' 
        });
        return;
      }

      await category.destroy();

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get category statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const totalCategories = await Category.count();
      const activeCategories = await Category.count({ where: { isActive: true } });
      const inactiveCategories = await Category.count({ where: { isActive: false } });

      // Get categories with most subcategories
      const topCategories = await Category.findAll({
        include: [{
          model: Subcategory,
          as: 'subcategories',
          attributes: []
        }],
        attributes: [
          'id',
          'title',
          [require('sequelize').fn('COUNT', require('sequelize').col('subcategories.id')), 'subcategoryCount']
        ],
        group: ['Category.id'],
        order: [[require('sequelize').fn('COUNT', require('sequelize').col('subcategories.id')), 'DESC']],
        limit: 5
      });

      res.json({
        success: true,
        data: {
          total: totalCategories,
          active: activeCategories,
          inactive: inactiveCategories,
          topCategories
        }
      });
    } catch (error) {
      console.error('Error fetching category stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
