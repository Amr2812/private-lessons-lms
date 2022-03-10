const boom = require("@hapi/boom");
const { constants } = require("../config/constants");

/**
 * @description Require authentication
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(boom.unauthorized());
  }

  if (
    req.user.role === constants.ROLES_ENUM.student &&
    !req.user.completed &&
    req.path !== "/profile"
  ) {
    return next(boom.unauthorized("Please complete your profile"));
  }

  return next();
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
    (req.user.role === constants.ROLES_ENUM.assistant ||
      req.user.role === constants.ROLES_ENUM.instructor)
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
  if (
    req.isAuthenticated() &&
    req.user.role === constants.ROLES_ENUM.instructor
  ) {
    return next();
  }

  next(boom.unauthorized());
};
