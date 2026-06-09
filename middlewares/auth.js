import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {

        throw new ApiError(401, "Unauthorized: please log in");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {

        res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
        throw new ApiError(401, "Unauthorized: token invalid or expired ");
    }
};

export default authMiddleware;