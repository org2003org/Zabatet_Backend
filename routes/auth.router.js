import express from "express";
import { createUser, loginUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

export default router;
