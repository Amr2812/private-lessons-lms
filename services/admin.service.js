const { adminRepo } = require("../repositories");

/**
 * @async
 * @description - Create a new assistant
 * @param  {Object} assistant
 * @returns {Promise<Object>} - The assistant object
 */
module.exports.createAssistant = async assistant =>
  await adminRepo.createAdmin(assistant);
