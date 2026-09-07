function notFound(req, res) {
  res.status(404).json({ message: "API route not found." });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? "Internal server error." : err.message
  });
}

module.exports = { notFound, errorHandler };

