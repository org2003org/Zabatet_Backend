import mongoose from "mongoose";
import Task from "../models/Task.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
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

const validateMentions = async (mentions, workspace) => {
    if (!mentions) return [];

    if (!Array.isArray(mentions)) {
        throw new ApiError(400, "Mentions must be an array");
    }

    const uniqueMentions = [...new Set(mentions.map((id) => id.toString()))];

    for (const id of uniqueMentions) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid mentioned user id");
        }
    }

    const users = await User.find({
        _id: { $in: uniqueMentions },
    }).select("_id");

    if (users.length !== uniqueMentions.length) {
        throw new ApiError(400, "One or more mentioned users do not exist");
    }

    const teamIds = [
        workspace.owner.toString(),
        ...workspace.members.map((memberId) => memberId.toString()),
    ];

    const invalidMention = uniqueMentions.find(
        (mentionId) => !teamIds.includes(mentionId)
    );

    if (invalidMention) {
        throw new ApiError(400, "Mentioned users must be workspace team members");
    }

    return uniqueMentions;
};

export const addComment = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { text, mentions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task id");
    }

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Comment text is required");
    }

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const { workspace } = await ensureBoardAccess(task.boardId, req);

    const validMentions = await validateMentions(mentions, workspace);

    const comment = await Comment.create({
        text: text.trim(),
        taskId: task._id,
        userId: getUserId(req),
        mentions: validMentions,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
});

export const getComments = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task id");
    }

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const comments = await Comment.find({ taskId: task._id });

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
})

export const editComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text, mentions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Comment text is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const userId = getUserId(req);

    if (comment.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You can edit only your own comment");
    }

    const task = await Task.findById(comment.taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const { workspace } = await ensureBoardAccess(task.boardId, req);

    const validMentions = await validateMentions(mentions, workspace);

    comment.text = text.trim();
    comment.mentions = validMentions;

    await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const userId = getUserId(req);

    if (comment.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You can delete only your own comment");
    }

    await comment.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Comment deleted successfully"));
});