import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
    addComment,
    editComment,
    deleteComment,
    getComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/tasks/:taskId", authMiddleware, addComment);

router.get("/tasks/:taskId", authMiddleware, getComments);

router.patch("/:commentId", authMiddleware, editComment);

router.delete("/:commentId", authMiddleware, deleteComment);

export default router;