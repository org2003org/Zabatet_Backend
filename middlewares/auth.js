import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        next(new ApiError(401, "Token is required"));
        return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
}
export default authMiddleware;