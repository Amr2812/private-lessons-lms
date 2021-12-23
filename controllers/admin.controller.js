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
  res.status(201).json(assistant);
};
