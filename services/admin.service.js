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

/**
 * @async
 * @description Upload admin's profile image
 * @param {Object} admin - Admin object
 * @param {Object} file - File object
 * @returns {Promise<String>} - Profile image link
 */
module.exports.updateProfileImage = async (admin, file) =>
  await upload(file, admin.id, "students");
