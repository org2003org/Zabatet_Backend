import express from 'express';
import taskRoutes from './taskRouts.js';
import boardRoutes from './boardRouts.js';
import authRoutes from './auth.router.js';
import usersRoutes from './users.router.js';
const router = express.Router();

// Use auth routes
router.use('/auth', authRoutes);

// Use task routes
router.use('/tasks', taskRoutes);

// Use board routes
router.use('/boards', boardRoutes);

// Use user routes
router.use('/users', usersRoutes);

export default router;