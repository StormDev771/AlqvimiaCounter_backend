const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, display_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authController.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/login
 * @description Authenticate a user
 * @access Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authController.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/google
 * @description Authenticate a user
 * @access Public
 */
router.post('/google', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authController.google(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/refresh-token
 * @description Refresh access token
 * @access Public (with refresh token)
 */
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const result = await authController.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/logout
 * @description Logout a user
 * @access Private
 */
router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    await authController.logout(refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/forgot-password
 * @description Request password reset
 * @access Public
 */
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const result = await authController.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/reset-password
 * @description Reset password with token
 * @access Public (with token)
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
    
    const result = await authController.resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/update-password
 * @description Update user password
 * @access Private
 */
router.post('/update-password', authMiddleware, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    const result = await authController.updatePassword(req.user.id, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
});


module.exports = router; 