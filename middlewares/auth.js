const boom = require("@hapi/boom");

/**
 * @description Require authentication
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  next(boom.unauthorized());
};

/**
 * @description Require admin
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.requireAdmin = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    (req.user.role === "assistant" || req.user.role === "instructor")
  ) {
    return next();
  }

  next(boom.unauthorized());
};

/**
 * @description Require instructor
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.requireInstructor = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "instructor") {
    return next();
  }

  next(boom.unauthorized());
};
