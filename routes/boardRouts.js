import {createBoard,getAllBoards,getBoardById,updateBoard,deleteBoard} from '../controllers/boardController.js';

import express from 'express';

const router = express.Router();
// Create a new board
router.post('/', createBoard);
// Get all boards
router.get('/', getAllBoards);
// Get a specific board by ID
router.get('/:id', getBoardById);
// Update a board
router.put('/:id', updateBoard);
// Delete a board
router.delete('/:id', deleteBoard);

export default router;

