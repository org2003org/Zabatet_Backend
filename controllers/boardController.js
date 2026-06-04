import Board from '../models/Board.js';

// Create a new board
export const createBoard = async (req, res) => {
    try {
        const { name, workspaceId } = req.body;
        if (!name || !workspaceId) {
            return res.status(400).json({ message: 'Name and workspaceId are required' });
        }
        const board = await Board.create({ name, workspaceId });
        return res.status(201).json(board, { message: "Board created successfully" });
    }
    catch (error) {
        console.error("Error creating board:", error);
        return res.status(500).json({ message: "Failed to create board", error: error.message });
    }
};

// Get all boards
export const getAllBoards = async (req, res) => {
    try {
        const boards = await Board.find().populate('workspaceId', 'name');
        return res.status(200).json(boards);
    } catch (error) {
        console.error("Error fetching boards:", error);
        return res.status(500).json({ message: "Failed to fetch boards", error: error.message });
    }
};

// update a board
export const updateBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const board = await Board.findByIdAndUpdate(id, { name }, { new: true });
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        return res.status(200).json(board, { message: "Board updated successfully" });
    } catch (error) {
        console.error("Error updating board:", error);
        return res.status(500).json({ message: "Failed to update board", error: error.message });
    }
};

// delete a board
export const deleteBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const board = await Board.findByIdAndDelete(id);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        return res.status(200).json({ message: "Board deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting board:", error);
        return res.status(500).json({ message: "Failed to delete board", error: error.message });
    }
};

// Get a single board by ID
export const getBoardById = async (req, res) => {
    try {
        const { id } = req.params;
        const board = await Board.findById(id).populate('workspaceId', 'name');
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        
        return res.status(200).json(board);
    } catch (error) {
        console.error("Error fetching board:", error);
        return res.status(500).json({ message: "Failed to fetch board", error: error.message });
    }
};