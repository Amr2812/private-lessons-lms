const { userService } = require("../services");
const boom = require("@hapi/boom");

/**
 * @async
 * @description get all users
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getUsers = async (req, res, next) => {
  const users = await userService.getUsers();

  if (!users) {
    return next(boom.notFound("Users not found"));
  }

  res.send(users);
};

/**
 * @async
 * @description get a user
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getUser = async (req, res, next) => {
  const user = await userService.getUser(req.params.id);

  if (!user) {
    return next(boom.notFound("User not found"));
  }

  res.send(user);
};

module.exports.updateProfileImage = async (req, res, next) => {
  const file = req.files.file;
  if (!file) return next(boom.badRequest("No file uploaded"));

  if (!file.type.include("image/"))
    return next(boom.badRequest("Invalid file type"));

  const user = await userService.updateProfileImage(req.user, file);

  res.send(user);
};
