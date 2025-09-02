import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { uploadSingle, uploadMultiple, uploadProfileImage } from '../middleware/upload';

const router = Router();

// General file upload (admin only)
router.post('/general', authenticateToken, requireAdmin, uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    return res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Multiple files upload (admin only)
router.post('/multiple', authenticateToken, requireAdmin, uploadMultiple, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const files = (req.files as Express.Multer.File[]).map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: `/uploads/${file.filename}`,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    }));

    return res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: files
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Profile image upload (admin only)
router.post('/profile', authenticateToken, requireAdmin, uploadProfileImage, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No profile image uploaded'
      });
    }

    return res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Profile image upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Category icon upload (admin only)
router.post('/category', authenticateToken, requireAdmin, uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No category icon uploaded'
      });
    }

    return res.json({
      success: true,
      message: 'Category icon uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Category icon upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Category icon upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Advertisement image upload (admin only)
router.post('/advertisement', authenticateToken, requireAdmin, uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No advertisement image uploaded'
      });
    }

    return res.json({
      success: true,
      message: 'Advertisement image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Advertisement image upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Advertisement image upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
