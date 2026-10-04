const errorHandler = (error, req, res, next) => {
  console.error(`${req.method} ${req.path}:`, error);

  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode = Number.isInteger(error.statusCode) && error.statusCode >= 400 && error.statusCode < 500
    ? error.statusCode
    : 500;
  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error" : error.message,
  });
};

module.exports = errorHandler;
