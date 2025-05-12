const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Authentication middleware
// router.use(authMiddleware);

/**
 * @route GET /api/users
 * @description Get all users
 * @access Private
 */
router.get('/', async (req, res, next) => {
  try {
    const users = await userController.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/users/:id
 * @description Get user by ID
 * @access Private
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await userController.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/users/me
 * @description Get current user's data
 * @access Private
 */
router.get('/me', async (req, res, next) => {
  try {
    const user = await userController.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/users
 * @description Create a new user
 * @access Private
 */
router.post('/', async (req, res, next) => {
  try {
    const user = await userController.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/users/:id
 * @description Update a user
 * @access Private
 */
router.put('/:id', async (req, res, next) => {
  try {
    const user = await userController.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/users/:id
 * @description Delete a user
 * @access Private
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await userController.deleteUser(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 