const notFoundHandler = (req,res,next)=>{
    const error = new Error(`Endpoint not found`);
    error.statusCode = 404;
    error.success = false;
    next(error);
}
export default notFoundHandler;