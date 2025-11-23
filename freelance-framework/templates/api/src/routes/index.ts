import { Router } from 'express';
import usersRouter from './users.js';

const router = Router();

// Mount routes
router.use('/users', usersRouter);

// API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      users: '/api/v1/users',
      health: '/health',
    },
  });
});

export default router;
