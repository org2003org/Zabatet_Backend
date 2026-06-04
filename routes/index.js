import express from 'express';
import taskRoutes from './taskRouts.js';
import boardRoutes from './boardRouts.js';
const router = express.Router();

// Use task routes
router.use('/tasks', taskRoutes);

// Use board routes
router.use('/boards', boardRoutes);

export default router;