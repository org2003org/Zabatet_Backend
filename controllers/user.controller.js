import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
export const getUsers = async (req, res) => {
    try {
        const { email } = req.query;
        const filter = email ? { email: { $regex: email, $options: "i" } } : {};
        const users = await User.find(filter);
        return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
    } catch (error) {
        // console.error("Error fetching users:", error);
        throw new ApiError(500, "Failed to fetch users", error.message);
    }
};
export const getUsersByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.find({ email: { $regex: email, $options: "i" } }).limit(5);

        return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to fetch user", error.message);
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
    } catch (error) {
        // console.error("Error fetching user:", error);
        throw new ApiError(500, "Failed to fetch user", error.message);
    }
};
export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
    } catch (error) {
        // console.error("Error fetching user:", error);
        throw new ApiError(500, "Failed to fetch user", error.message);
    }
};
export const updateUser = async (req, res) => {
    try {

        const { name } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        user.name = name;
        await user.save();
        return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
    } catch (error) {
        // console.error("Error updating user:", error);
        throw new ApiError(500, "Failed to update user", error.message);
    }
};

