import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

// Category validation
export const validateCategory = [
  body('title').trim().isLength({ min: 2, max: 45 }).withMessage('Title must be between 2 and 45 characters'),
  body('icon').optional().isURL().withMessage('Icon must be a valid URL'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color'),
  handleValidationErrors
];

// Subcategory validation
export const validateSubcategory = [
  body('title').trim().isLength({ min: 2, max: 45 }).withMessage('Title must be between 2 and 45 characters'),
  body('categoryId').isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('icon').optional().isURL().withMessage('Icon must be a valid URL'),
  handleValidationErrors
];

// User validation
export const validateUser = [
  body('fullName').trim().isLength({ min: 2, max: 45 }).withMessage('Full name must be between 2 and 45 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['user', 'worker', 'admin']).withMessage('Invalid role'),
  body('phoneNumber').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number'),
  handleValidationErrors
];

// Worker validation
export const validateWorker = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
  body('phoneNumber').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number'),
  body('categoryId').isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('subcategoryId').isInt({ min: 1 }).withMessage('Subcategory ID must be a positive integer'),
  body('hourlyRate').isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of 2 numbers'),
  handleValidationErrors
];

// Order validation
export const validateOrder = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('customerId').isInt({ min: 1 }).withMessage('Customer ID must be a positive integer'),
  body('workerId').notEmpty().withMessage('Worker ID is required'),
  body('categoryId').isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('subcategoryId').isInt({ min: 1 }).withMessage('Subcategory ID must be a positive integer'),
  body('scheduledDate').isISO8601().withMessage('Scheduled date must be a valid date'),
  body('scheduledTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Scheduled time must be in HH:MM format'),
  body('estimatedDuration').isFloat({ min: 0.5, max: 24 }).withMessage('Estimated duration must be between 0.5 and 24 hours'),
  body('totalPrice').isFloat({ min: 0 }).withMessage('Total price must be a positive number'),
  body('paymentMethod').isIn(['cash', 'card', 'bank-transfer']).withMessage('Invalid payment method'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  handleValidationErrors
];

// Advertisement validation
export const validateAdvertisement = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('imageUrl').isURL().withMessage('Image URL must be a valid URL'),
  body('linkUrl').optional().isURL().withMessage('Link URL must be a valid URL'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('priority').optional().isInt({ min: 1, max: 10 }).withMessage('Priority must be between 1 and 10'),
  body('targetAudience').isIn(['all', 'customers', 'workers', 'specific-category']).withMessage('Invalid target audience'),
  handleValidationErrors
];
