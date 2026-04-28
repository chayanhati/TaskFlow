const { ValidationError, UniqueConstraintError, DatabaseError } = require('sequelize');

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Sequelize validation errors
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
  }

  // Sequelize unique constraint
  if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = 'A record with this value already exists';
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
  }

  // Sequelize database errors
  if (err instanceof DatabaseError) {
    statusCode = 500;
    message = 'Database error occurred';
  }

  // JWT errors (should be handled in middleware, but just in case)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
