import ApiError from "../utils/ApiError.js";
const authorize = (roles) => {
    return (req, res, next) => {
        if(!req.user?.role || !roles.includes(req.user.role)){
            next(new ApiError(403, "You are not authorized to access this resource"));
            return;
        }
        next();
    }
}
export default authorize;