class AppError extends Error {
  constructor(message, statusCode = 500, errors = undefined) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = AppError;
