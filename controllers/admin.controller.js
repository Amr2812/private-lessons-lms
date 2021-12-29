const { adminService } = require("../services");
const boom = require("@hapi/boom");

/**
 * @async
 * @description create a new assistant
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.createAssistant = async (req, res, next) => {
  const assistant = await adminService.createAssistant(req.body);
  res.status(201).send(assistant);
};

/**
 * @async
 * @description put/update an admin's profile picture
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.updateProfileImage = async (req, res, next) => {
  const file = req.files.file;
  if (!file) return next(boom.badRequest("No file uploaded"));

  if (!file.type.includes("image/"))
    return next(boom.badRequest("Invalid file type"));

    const admin = await adminService.updateProfileImage(req.user, file);

  res.send(admin);
};

