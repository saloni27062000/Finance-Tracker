module.exports.notfoundMiddleware = (req, res, next) => {
  try {
    res.status(404).json({
        "message":"Route Not Found: endpoint" + req.url,
    })
  } catch (error) {
    next(error);
  }
};
