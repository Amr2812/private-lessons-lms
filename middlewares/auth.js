const boom = require("@hapi/boom");
const { constants } = require("../config/constants");
const { studentService, adminService } = require("../services");

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
    studentService.isStudent(req.user) &&
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
  if (req.isAuthenticated() && adminService.isAdmin(req.user)) {
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
  if (req.isAuthenticated() && adminService.isInstructor(req.user)) {
    return next();
  }

  next(boom.unauthorized());
};
