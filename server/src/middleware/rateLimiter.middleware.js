const rateLimitWindowMs = 1 * 60 * 1000; // 15 minutes
const maxRequestsPerWindow = 100;
const requestLog = new Map();

const cleanupExpiredIps = () => {
  const now = Date.now();
  for (const [ip, record] of requestLog.entries()) {
    if (now - record.firstRequestTime > rateLimitWindowMs) {
      requestLog.delete(ip);
    }
  }
};

setInterval(cleanupExpiredIps, rateLimitWindowMs).unref();

module.exports.rateLimiterMiddleware = (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();
  const record = requestLog.get(ip);

  if (!record || now - record.firstRequestTime > rateLimitWindowMs) {
    requestLog.set(ip, { count: 1, firstRequestTime: now });
    return next();
  }

  record.count += 1;
  if (record.count > maxRequestsPerWindow) {
    return res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  }

  next();
};