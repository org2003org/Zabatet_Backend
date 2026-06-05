import Sprint from "../models/Sprint.js";
import Task from "../models/Task.js";

// Create a new sprint
export const createSprint = async (req, res) => {
    try {
        const { name, goal, startDate, endDate, boardId } = req.body;
        if (!name || !startDate || !endDate || !boardId) {
            return res.status(400).json({ message: 'Name, startDate, endDate, and boardId are required' });
        }
        
        const sprint = await Sprint.create({
            name,
            goal,
            startDate,
            endDate,
            boardId
        });

        return res.status(201).json({ sprint, message: "Sprint created successfully" });
    } catch (error) {
        console.error("Error creating sprint:", error);
        return res.status(500).json({ message: "Failed to create sprint", error: error.message });
    }
};

// Get all sprints for a specific board
export const getSprintsByBoard = async (req, res) => {
    try {
        const { boardId } = req.params;
        const sprints = await Sprint.find({ boardId });
        return res.status(200).json(sprints);
    } catch (error) {
        console.error("Error fetching sprints:", error);
        return res.status(500).json({ message: "Failed to fetch sprints", error: error.message });
    }
};

// Get a single sprint by ID
export const getSprintById = async (req, res) => {
    try {
        const { id } = req.params;
        const sprint = await Sprint.findById(id);
        if (!sprint) {
            return res.status(404).json({ message: "Sprint not found" });
        }
        return res.status(200).json(sprint);
    } catch (error) {
        console.error("Error fetching sprint:", error);
        return res.status(500).json({ message: "Failed to fetch sprint", error: error.message });
    }
};

// Update a sprint
export const updateSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const sprint = await Sprint.findByIdAndUpdate(id, updates, { new: true });
        if (!sprint) {
            return res.status(404).json({ message: "Sprint not found" });
        }
        return res.status(200).json({ sprint, message: "Sprint updated successfully" });
    } catch (error) {
        console.error("Error updating sprint:", error);
        return res.status(500).json({ message: "Failed to update sprint", error: error.message });
    }
};

// Delete a sprint
export const deleteSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const sprint = await Sprint.findByIdAndDelete(id);
        if (!sprint) {
            return res.status(404).json({ message: "Sprint not found" });
        }
        return res.status(200).json({ message: "Sprint deleted successfully" });
    } catch (error) {
        console.error("Error deleting sprint:", error);
        return res.status(500).json({ message: "Failed to delete sprint", error: error.message });
    }
};

// Start a sprint
export const startSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const sprint = await Sprint.findByIdAndUpdate(id, { status: 'Active' }, { new: true });
        if (!sprint) {
            return res.status(404).json({ message: "Sprint not found" });
        }
        return res.status(200).json({ sprint, message: "Sprint started successfully" });
    } catch (error) {
        console.error("Error starting sprint:", error);
        return res.status(500).json({ message: "Failed to start sprint", error: error.message });
    }
};

// Complete a sprint
export const completeSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const sprint = await Sprint.findByIdAndUpdate(id, { status: 'Completed' }, { new: true });
        if (!sprint) {
            return res.status(404).json({ message: "Sprint not found" });
        }
        return res.status(200).json({ sprint, message: "Sprint completed successfully" });
    } catch (error) {
        console.error("Error completing sprint:", error);
        return res.status(500).json({ message: "Failed to complete sprint", error: error.message });
    }
};

// Add tasks to a sprint
export const addTasksToSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const { taskIds } = req.body;
        if (!taskIds || !Array.isArray(taskIds)) {
            return res.status(400).json({ message: "taskIds must be an array" });
        }
        
        await Task.updateMany(
            { _id: { $in: taskIds } },
            { $set: { sprintId: id } }
        );
        
        return res.status(200).json({ message: "Tasks added to sprint successfully" });
    } catch (error) {
        console.error("Error adding tasks to sprint:", error);
        return res.status(500).json({ message: "Failed to add tasks to sprint", error: error.message });
    }
};

// Remove tasks from a sprint (Move back to backlog)
export const removeTasksFromSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const { taskIds } = req.body;
        if (!taskIds || !Array.isArray(taskIds)) {
            return res.status(400).json({ message: "taskIds must be an array" });
        }

        await Task.updateMany(
            { _id: { $in: taskIds }, sprintId: id },
            { $set: { sprintId: null, status: 'Backlog' } }
        );
        
        return res.status(200).json({ message: "Tasks removed from sprint successfully" });
    } catch (error) {
        console.error("Error removing tasks from sprint:", error);
        return res.status(500).json({ message: "Failed to remove tasks from sprint", error: error.message });
    }
};
