const { authService } = require("../services");
const passport = require("passport");
const boom = require("@hapi/boom");

/**
 * @async
 * @description Signup a new user
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.studentSignup = async (req, res, next) => {
  const student = await authService.signup(req.body);

  req.logIn(student, err => {
    if (err) {
      return next(err);
    }
  });
  res.status(201).json(student);
};

/**
 * @async
 * @description Login a user
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.studentLogin = async (req, res, next) => {
  passport.authenticate("student-local", (err, student, info) => {
    if (err) {
      return next(err);
    }

    if (!student) {
      return next(boom.badRequest("Incorrect email or password"));
    }

    req.logIn(student, err => {
      if (err) {
        return next(err);
      }
    });
    return res.send(student);
  })(req, res, next);
};

/**
 * @async
 * @description Login an admin
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.adminLogin = async (req, res, next) => {
  passport.authenticate("admin-local", (err, admin, info) => {
    if (err) {
      return next(err);
    }

    if (!admin) {
      return next(boom.badRequest("Incorrect email or password"));
    }

    req.logIn(admin, err => {
      if (err) {
        return next(err);
      }
    });
    return res.send(admin);
  })(req, res, next);
};

/**
 * @description Logout a user
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.logout = (req, res, next) => {
  req.logout();
  res.send();
};
