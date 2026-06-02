/**
 * EcoTrack Global Error Handler Middleware
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err.stack || err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Handle Mongoose Cast Error (Bad ID formats)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found. Invalid field: ${err.path}`;
  }

  // Handle MongoDB Duplicate Key (e.g. registered email)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Email already exists. Please choose a different email.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
