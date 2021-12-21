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
