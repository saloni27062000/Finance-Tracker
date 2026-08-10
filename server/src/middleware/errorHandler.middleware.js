module.exports.errorHandlerMiddleware = (err, req, res, next) => {
  try {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  } catch (error) {
    console.log("Unexpexted Error: " + error.message);
  }
};
