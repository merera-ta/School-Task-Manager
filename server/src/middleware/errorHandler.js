const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// Express recognises error handlers by their four arguments, so `next` must stay.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors;

  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Request body contains invalid JSON";
  } else if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  } else if (!(err instanceof AppError) && statusCode >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production")
      message = "Internal server error";
  }

  const body = { success: false, message };
  if (errors) body.errors = errors;
  res.status(statusCode).json(body);
};

module.exports = { notFound, errorHandler };
