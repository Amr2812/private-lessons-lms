const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("../config/redis");
const boom = require("@hapi/boom");

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "RL",
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
  blockDuration: 60 * 15 // 15 minutes
});

/**
 * @description - Middleware to limit the number of requests
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(rateLimiterRes => {
      res.set({
        "Retry-After": rateLimiterRes.msBeforeNext / 1000,
        "X-RateLimit-Limit": 10,
        "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
        "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext)
      });
      next();
    })
    .catch(rateLimiterRes => {
      res.set({
        "Retry-After": rateLimiterRes.msBeforeNext / 1000,
        "X-RateLimit-Limit": 10,
        "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
        "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext)
      });
      next(boom.tooManyRequests());
    });
};

module.exports = rateLimiterMiddleware;
