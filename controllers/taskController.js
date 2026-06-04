import Task from "../models/Task.js";


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