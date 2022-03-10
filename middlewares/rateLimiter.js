const { RateLimiterRedis } = require("rate-limiter-flexible");
const boom = require("@hapi/boom");
const { constants } = require("../config/constants");
const redisClient = require("../config/redis");

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: constants.RATE_LIMITER_PERFIX,
  points: constants.RATE_LIMITER_POINTS,
  duration: 1,
  blockDuration: constants.RATE_LIMITER_BLOCK_DURATION
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
