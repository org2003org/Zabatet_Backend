import express from 'express';
import taskRoutes from './taskRouts.js';
import boardRoutes from './boardRouts.js';
import authRoutes from './auth.router.js';
import workspaceRoutes from './workspaceRoutes.js';
import usersRoutes from './users.router.js';
import sprintRoutes from './sprintRoutes.js';

const router = express.Router();

// Use auth routes
router.use('/auth', authRoutes);

// Use task routes
router.use('/tasks', taskRoutes);

// Use board routes
router.use('/boards', boardRoutes);

// Use workspace routes
router.use('/workspaces', workspaceRoutes);

// Use user routes
router.use('/users', usersRoutes);

// Use sprint routes
router.use('/sprints', sprintRoutes);

export default router;