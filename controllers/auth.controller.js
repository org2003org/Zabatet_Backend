import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";

const getToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const createUser = async (req, res) => {
    const { email, password, role, name } = req.body;
    if (email && password) {
        const existingUserWithEmail = await User.findOne({ email });
        if (existingUserWithEmail) {
            throw new ApiError(409, "email already exists");
        }
        const user = await User.create({ email, passwordHash: password, role, name });
        user.passwordHash = undefined;
        const token = getToken(user);
        res.cookie("token", token, cookieOptions);
        return res.status(201).json(new ApiResponse(201, { user, token }, "User created successfully"));
    } else {
        throw new ApiError(400, "email and password are required");
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email && !password) {
        throw new ApiError(400, "Email and password are required");
    }
    let user = null;
    if (email) {
        user = await User.findOne({ email }).select("+passwordHash");
    }
    if (!user) {
        throw new ApiError(401, "Invalid Credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Credentials");
    }
    const token = getToken(user);
    user.passwordHash = undefined;
    res.cookie("token", token, cookieOptions);
    const isApiClient = req.headers.accept?.includes("application/json");
    const data = isApiClient ? { user, token } : { user };
    return res.status(200).json(new ApiResponse(200, data, "Login successful"));
};

export const logoutUser = async (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
};