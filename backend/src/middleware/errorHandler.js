const errorHandler = (error, req, res, next) => {
  console.error(`${req.method} ${req.path}:`, error);

  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
