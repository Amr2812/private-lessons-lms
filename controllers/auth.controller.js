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
module.exports.signup = async (req, res, next) => {
  const user = await authService.signup(req.body);

  req.logIn(user, err => {
    if (err) {
      return next(err);
    }
  });
  res.status(201).json(user);
};

/**
 * @async
 * @description Login a user
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      next(boom.badRequest("Incorrect email or password"));
    }

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
    });
    return res.send(user);
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
