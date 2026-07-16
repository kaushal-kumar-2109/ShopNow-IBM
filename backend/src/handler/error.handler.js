const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Development environment: Send back full details including stack trace
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // Production environment: Hide implementation leaks from clients
  if (err.isOperational) {
    // Trusted operational error: send message to client
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message
    });
  }

  // Unknown programmer or system errors: don't leak details
  console.error('ERROR 💥:', err); // Log to your internal monitoring system
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};

module.exports = errorHandler;
