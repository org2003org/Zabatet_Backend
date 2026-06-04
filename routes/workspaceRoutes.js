import express from "express";
import {
    createWorkspace,
    updateWorkspace,
    inviteMember,
    removeMember,
    getWorkspaceMembers,
    getMyWorkspaces,
    getWorkspaceById,
    deleteWorkspace,
} from "../controllers/workspaceController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// All workspace routes require authentication
router.use(authMiddleware);

// Create new workspace
router.post("/", createWorkspace);

// Get all workspaces for the authenticated user
router.get("/", getMyWorkspaces);

// Get workspace by ID
router.get("/:id", getWorkspaceById);

// Update workspace
router.put("/:id", updateWorkspace);

// Delete workspace
router.delete("/:id", deleteWorkspace);

// Invite member (by email)
router.post("/:id/members", inviteMember);

// Get all members of workspace
router.get("/:id/members", getWorkspaceMembers);

// Remove member
router.delete("/:id/members/:memberId", removeMember);

export default router;
