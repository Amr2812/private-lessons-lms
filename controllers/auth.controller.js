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
module.exports.login = async (req, res, next) => {
  passport.authenticate(`${req.query.role}-local`, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(boom.badRequest(info.message));
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
  res.sendStatus(204);
};

/**
 * @async
 * @description Forgot password
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.forgotPassword = async (req, res, next) => {
  await authService.forgotPassword(req.body);

  res.sendStatus(204);
};

/**
 * @async
 * @description Reset password
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.resetPassword = async (req, res, next) => {
  const user = await authService.resetPassword(
    req.params.resetPasswordToken,
    req.body
  );
  if (user instanceof Error) next(user);

  res.sendStatus(204);
};
