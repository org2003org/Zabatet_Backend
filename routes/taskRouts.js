import { createTask, getAllTasks, getTasksByBoard, getTaskById, updateTask, deleteTask, getTasksBySprint, assignUserToTask, updateTaskStatus, addLabelsToTask } from '../controllers/taskController.js';
import express from 'express';

const router = express.Router();

// Create a new task
router.post('/', createTask);
// Get all tasks
router.get('/', getAllTasks);
// Get tasks by board ID
router.get('/board/:boardId', getTasksByBoard);
// Get a specific task by ID
router.get('/:id', getTaskById);
// Update a task
router.put('/:id', updateTask);
// Delete a task
router.delete('/:id', deleteTask);
// Get tasks by sprint ID
router.get('/sprint/:sprintId', getTasksBySprint);
// Assign a user to a task
router.put('/:id/assignee', assignUserToTask);
// Update task status
router.put('/:id/status', updateTaskStatus);
// Add labels to a task
router.put('/:id/labels', addLabelsToTask);

export default router;