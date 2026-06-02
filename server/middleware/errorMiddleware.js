const errorHandler = (err, req, res, next) => {
  // Set status code. Default is 500 if not set.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);

  console.error(`Error Handler: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(444 || 404);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
