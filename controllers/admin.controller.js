const { adminService, actionService, storageService } = require("../services");
const boom = require("@hapi/boom");
const multer = require("multer");
const { constants } = require("../config/constants");

module.exports.updateProfileImage = multer({
  storage: storageService.createGCStorage({
    destination: (req, file, cb) => {
      cb(null, { name: req.user.id, folder: "admins" });
    }
  }),
  limits: { fileSize: constants.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes("image/"))
      return cb(boom.badRequest("Invalid file type"));

    cb(null, true);
  }
});


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
