
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // console.log(err);
  return res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  });
}
export default errorHandler;