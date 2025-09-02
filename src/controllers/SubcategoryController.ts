import { Request, Response } from 'express';
import { Subcategory, Category } from '../models';

export class SubcategoryController {
  // Get all subcategories with optional filtering
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, categoryId, isActive } = req.query;
      
      const whereClause: any = {};
      if (search) {
        whereClause.title = { [require('sequelize').Op.like]: `%${search}%` };
      }
      if (categoryId) {
        whereClause.categoryId = Number(categoryId);
      }
      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const offset = (Number(page) - 1) * Number(limit);
      
      const { count, rows } = await Subcategory.findAndCountAll({
        where: whereClause,
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'title', 'icon', 'color']
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
      console.error('Error fetching subcategories:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get subcategories by category ID
  static async getByCategoryId(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      
      const subcategories = await Subcategory.findAll({
        where: { 
          categoryId: Number(categoryId),
          isActive: true
        },
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'title', 'icon', 'color']
        }],
        order: [['title', 'ASC']]
      });

      res.json({
        success: true,
        data: subcategories
      });
    } catch (error) {
      console.error('Error fetching subcategories by category:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get single subcategory by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const subcategory = await Subcategory.findByPk(Number(id), {
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'title', 'icon', 'color', 'description']
        }]
      });

      if (!subcategory) {
        res.status(404).json({ 
          success: false, 
          message: 'Subcategory not found' 
        });
        return;
      }

      res.json({
        success: true,
        data: subcategory
      });
    } catch (error) {
      console.error('Error fetching subcategory:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Create new subcategory
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, categoryId, description, icon, createdBy } = req.body;

      // Check if category exists
      const category = await Category.findByPk(Number(categoryId));
      if (!category) {
        res.status(400).json({ 
          success: false, 
          message: 'Category not found' 
        });
        return;
      }

      // Check if subcategory with same title in this category already exists
      const existingSubcategory = await Subcategory.findOne({ 
        where: { title, categoryId: Number(categoryId) } 
      });
      if (existingSubcategory) {
        res.status(400).json({ 
          success: false, 
          message: 'Subcategory with this title already exists in this category' 
        });
        return;
      }

      const subcategory = await Subcategory.create({
        title,
        categoryId: Number(categoryId),
        description,
        icon,
        createdBy,
        isActive: true,
        createdAt: new Date()
      });

      res.status(201).json({
        success: true,
        message: 'Subcategory created successfully',
        data: subcategory
      });
    } catch (error) {
      console.error('Error creating subcategory:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Update subcategory
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, icon, isActive } = req.body;

      const subcategory = await Subcategory.findByPk(Number(id));
      if (!subcategory) {
        res.status(404).json({ 
          success: false, 
          message: 'Subcategory not found' 
        });
        return;
      }

      // Check if title is being changed and if it conflicts with existing subcategory in same category
      if (title && title !== subcategory.title) {
        const existingSubcategory = await Subcategory.findOne({ 
          where: { 
            title, 
            categoryId: subcategory.categoryId,
            id: { [require('sequelize').Op.ne]: Number(id) }
          } 
        });
        if (existingSubcategory) {
          res.status(400).json({ 
            success: false, 
            message: 'Subcategory with this title already exists in this category' 
          });
          return;
        }
      }

      await subcategory.update({
        title: title || subcategory.title,
        description: description !== undefined ? description : subcategory.description,
        icon: icon !== undefined ? icon : subcategory.icon,
        isActive: isActive !== undefined ? isActive : subcategory.isActive
      });

      res.json({
        success: true,
        message: 'Subcategory updated successfully',
        data: subcategory
      });
    } catch (error) {
      console.error('Error updating subcategory:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Delete subcategory
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const subcategory = await Subcategory.findByPk(Number(id));
      if (!subcategory) {
        res.status(404).json({ 
          success: false, 
          message: 'Subcategory not found' 
        });
        return;
      }

      // Check if subcategory is being used in orders
      // This would require checking the Order model in MongoDB
      // For now, we'll just delete it

      await subcategory.destroy();

      res.json({
        success: true,
        message: 'Subcategory deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get subcategory statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const totalSubcategories = await Subcategory.count();
      const activeSubcategories = await Subcategory.count({ where: { isActive: true } });
      const inactiveSubcategories = await Subcategory.count({ where: { isActive: false } });

      // Get subcategories by category
      const subcategoriesByCategory = await Category.findAll({
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
        order: [[require('sequelize').fn('COUNT', require('sequelize').col('subcategories.id')), 'DESC']]
      });

      res.json({
        success: true,
        data: {
          total: totalSubcategories,
          active: activeSubcategories,
          inactive: inactiveSubcategories,
          byCategory: subcategoriesByCategory
        }
      });
    } catch (error) {
      console.error('Error fetching subcategory stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
