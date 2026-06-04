import express from "express";
import {
    getUsers,
    getUsersByEmail,
    getUserById,
    getUserInfo,
    updateUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.get("/", authMiddleware, authorize("Admin"), getUsers);

router.get("/me", authMiddleware, getUserInfo);

router.get("/email/:email", getUsersByEmail);

router.get("/:id", getUserById);

router.patch("/me", authMiddleware, updateUser);

export default router;