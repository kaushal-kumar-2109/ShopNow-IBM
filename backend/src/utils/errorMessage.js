class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes known app errors from system crashes

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;