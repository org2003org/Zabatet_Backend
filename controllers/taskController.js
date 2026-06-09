import mongoose from "mongoose";
import Task from "../models/Task.js";
import Sprint from "../models/Sprint.js";
import Board from "../models/Board.js";
import Workspace from "../models/Workspace.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getUserId = (req) => {
    return req.user?._id || req.user?.id || req.user?.userId;
};

const ensureBoardAccess = async (boardId, req) => {
    const userId = getUserId(req);

    const board = await Board.findById(boardId);

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    const workspace = await Workspace.findById(board.workspaceId);

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    const isOwner = workspace.owner.toString() === userId.toString();

    const isMember = workspace.members.some(
        (memberId) => memberId.toString() === userId.toString()
    );

    const isAdmin = req.user?.role === "Admin";

    if (!isOwner && !isMember && !isAdmin) {
        throw new ApiError(403, "You do not have access to this board");
    }

    return { board, workspace };
};

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, assignee, boardId, sprintId, storyPoints, labels, dueDate } = req.body;
        if (!title || !boardId) {
            return res.status(400).json({ message: 'Title and boardId are required' });
        }
        
        const task = await Task.create({
            title,
            description,
            priority,
            status,
            assignee,
            boardId,
            sprintId,
            storyPoints,
            labels,
            dueDate
        });

       return res.status(201).json(task ,{ message: "Task created successfully" });
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "Failed to create task" , error: error.message });
    }
};
// get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignee', 'name email').populate('sprintId', 'name');
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Failed to fetch tasks" , error: error.message });
    }
};
// Get all tasks for a specific board
export const getTasksByBoard = async (req, res) => {
    try {
        const { boardId } = req.params;
        const tasks = await Task.find({ boardId }).populate('assignee', 'name email').populate('sprintId', 'name');
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Failed to fetch tasks" , error: error.message });
    }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id).populate('assignee', 'name email').populate('sprintId', 'name');
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        return res.status(500).json({ message: "Failed to fetch task" , error: error.message });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const task = await Task.findByIdAndUpdate(id, updates, { new: true }).populate('assignee', 'name email').populate('sprintId', 'name');
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task ,{ message: "Task updated successfully" });
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: "Failed to update task" , error: error.message });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: "Failed to delete task" , error: error.message });
    }
};

// Get all tasks for a specific sprint
export const getTasksBySprint = async (req, res) => {
    try {
        const { sprintId } = req.params;
        const tasks = await Task.find({ sprintId }).populate('assignee', 'name email').populate('sprintId', 'name');
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Failed to fetch tasks" , error: error.message });
    }
};

// Assign a user to a task
export const assignUserToTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const task = await Task.findByIdAndUpdate(id, { assignee: userId }, { new: true }).populate('assignee', 'name email').populate('sprintId', 'name');
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (error) {
        console.error("Error assigning user to task:", error);
        return res.status(500).json({ message: "Failed to assign user to task" , error: error.message });
    }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(id, { status }, { new: true }).populate('assignee', 'name email').populate('sprintId', 'name');
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (error) {
        console.error("Error updating task status:", error);
        return res.status(500).json({ message: "Failed to update task status" , error: error.message });
    }
};

// add labels to a task
export const addLabelsToTask = async (req, res) => {
    try {        const { id } = req.params;
        const { labels } = req.body;
        const task = await Task.findByIdAndUpdate(id, { $addToSet: { labels: { $each: labels } } }, { new: true }).populate('assignee', 'name email').populate('sprintId', 'name');
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (error) {
        console.error("Error adding labels to task:", error);
        return res.status(500).json({ message: "Failed to add labels to task" , error: error.message });
    }
};

export const updateTaskPriority = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { priority } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task id");
    }

    const allowedPriorities = ["Low", "Medium", "High"];

    if (!allowedPriorities.includes(priority)) {
        throw new ApiError(400, "Priority must be Low, Medium, or High");
    }

    const task = await Task.findById(id);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    await ensureBoardAccess(task.boardId, req);

    task.priority = priority;

    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task priority updated successfully"));
});

export const assignStoryPoints = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { storyPoints } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task id");
    }

    if (!Number.isInteger(storyPoints) || storyPoints < 0) {
        throw new ApiError(400, "Story points must be an integer greater than or equal to 0");
    }

    const task = await Task.findById(id);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    await ensureBoardAccess(task.boardId, req);

    task.storyPoints = storyPoints;

    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Story points assigned successfully"));
});

export const moveTaskToSprint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { sprintId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task id");
    }

    if (!mongoose.Types.ObjectId.isValid(sprintId)) {
        throw new ApiError(400, "Invalid sprint id");
    }

    const task = await Task.findById(id);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    await ensureBoardAccess(task.boardId, req);

    if (task.status !== "Backlog" || task.sprintId !== null) {
        throw new ApiError(400, "Only backlog tasks can be moved to a sprint");
    }

    const sprint = await Sprint.findById(sprintId);

    if (!sprint) {
        throw new ApiError(404, "Sprint not found");
    }

    if (sprint.boardId.toString() !== task.boardId.toString()) {
        throw new ApiError(400, "Sprint must belong to the same board as the task");
    }

    task.sprintId = sprint._id;
    task.status = "To Do";

    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task moved to sprint successfully"));
});
