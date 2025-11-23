import { Router } from 'express';
import { z } from 'zod';
import { userService } from '../services/userService.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Validation schemas
const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  }),
});

const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

// GET /users - List all users
router.get('/', async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// GET /users/:id - Get user by ID
router.get('/:id', validate(getUserSchema), async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// POST /users - Create new user
router.post('/', validate(createUserSchema), async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Delete user
router.delete('/:id', validate(getUserSchema), async (req, res, next) => {
  try {
    await userService.delete(req.params.id);
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
