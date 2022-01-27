const { adminService, actionService, storageService } = require("../services");
const multer = require("multer");
const { constants } = require("../config/constants");

module.exports.updateProfileImage = multer({
  storage: storageService.createGCStorage({
    destination: (req, file, cb) => {
      cb(null, { name: req.user.id, folder: "admins" });
    },
    fileType: "image"
  }),
  limits: { fileSize: constants.MAX_FILE_SIZE }
});

/**
 * @async
 * @description get profile of admin
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getProfile = async (req, res, next) => res.send(req.user);

/**
 * @async
 * @description update profile of admin
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.updateProfile = async (req, res, next) => {
  const profile = await adminService.updateProfile(req.user.id, req.body);

  res.send(profile);
};

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
 * @description get all actions
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getActions = async (req, res, next) => {
  const actions = await actionService.getActions(req.query);
  res.send(actions);
};
