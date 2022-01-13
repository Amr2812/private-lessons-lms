const { Admin } = require("../models");
const { upload } = require("./storage.service");

/**
 * @async
 * @description - Create a new assistant
 * @param  {Object} assistant
 * @returns {Promise<Object>} - The assistant object
 */
module.exports.createAssistant = async assistant =>
  await Admin.create(assistant);
