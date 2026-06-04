import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new workspace
export const createWorkspace = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Workspace name is required");
    }

    const workspace = await Workspace.create({
        name,
        description,
        owner: req.user.id,
        members: [req.user.id], // Owner is automatically a member
    });

    const populated = await workspace.populate("owner", "name email");

    return res
        .status(201)
        .json(new ApiResponse(201, populated, "Workspace created successfully"));
});

// Update a workspace (only owner can update)
export const updateWorkspace = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    // Only the owner can update the workspace
    if (workspace.owner.toString() !== req.user.id) {
        throw new ApiError(403, "Only the workspace owner can update it");
    }

    if (name)
        workspace.name = name;
    if (description !== undefined)
        workspace.description = description;

    await workspace.save();

    const populated = await workspace.populate([
        { path: "owner", select: "name email" },
        { path: "members", select: "name email" },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, populated, "Workspace updated successfully"));
});

// Invite a member to the workspace (by email)
export const inviteMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Member email is required");
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    // Only the owner can invite members
    if (workspace.owner.toString() !== req.user.id) {
        throw new ApiError(403, "Only the workspace owner can invite members");
    }

    const userToInvite = await User.findOne({ email });

    if (!userToInvite) {
        throw new ApiError(404, "User not found with this email");
    }

    if (workspace.members.includes(userToInvite._id)) {
        throw new ApiError(409, "User is already a member of this workspace");
    }

    workspace.members.push(userToInvite._id);
    await workspace.save();

    const populated = await workspace.populate([
        { path: "owner", select: "name email" },
        { path: "members", select: "name email" },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, populated, "Member invited successfully"));
});

// Remove a member from the workspace
export const removeMember = asyncHandler(async (req, res) => {
    const { id, memberId } = req.params;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    // Only the owner can remove members
    if (workspace.owner.toString() !== req.user.id) {
        throw new ApiError(403, "Only the workspace owner can remove members");
    }

    if (memberId === workspace.owner.toString()) {
        throw new ApiError(400, "Cannot remove the workspace owner");
    }

    const memberIndex = workspace.members.findIndex(
        (m) => m.toString() === memberId
    );

    if (memberIndex === -1) {
        throw new ApiError(404, "User is not a member of this workspace");
    }

    workspace.members.splice(memberIndex, 1);
    await workspace.save();

    const populated = await workspace.populate([
        { path: "owner", select: "name email" },
        { path: "members", select: "name email" },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, populated, "Member removed successfully"));
});

// Get all members of a workspace
export const getWorkspaceMembers = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const workspace = await Workspace.findById(id)
        .populate("members", "name email role")
        .populate("owner", "name email role");

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    // Only members can view the team
    const isMember = workspace.members.some(
        (m) => m._id.toString() === req.user.id
    );

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this workspace");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { owner: workspace.owner, members: workspace.members },
                "Team members fetched successfully"
            )
        );
});

// Get all workspaces the authenticated user belongs to
export const getMyWorkspaces = asyncHandler(async (req, res) => {
    const workspaces = await Workspace.find({
        members: req.user.id,
    })
        .populate("owner", "name email")
        .populate("members", "name email");

    return res
        .status(200)
        .json(
            new ApiResponse(200, workspaces, "Workspaces fetched successfully")
        );
});

// Get a single workspace by ID
export const getWorkspaceById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const workspace = await Workspace.findById(id)
        .populate("owner", "name email")
        .populate("members", "name email");

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    const isMember = workspace.members.some(
        (m) => m._id.toString() === req.user.id
    );

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this workspace");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, workspace, "Workspace fetched successfully"));
});

// Delete a workspace (only owner)
export const deleteWorkspace = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    if (workspace.owner.toString() !== req.user.id) {
        throw new ApiError(403, "Only the workspace owner can delete it");
    }

    await Workspace.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Workspace deleted successfully"));
});
