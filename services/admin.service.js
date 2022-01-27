const { Admin } = require("../models");

/**
 * @async
 * @description - Update admin profile
 * @param {String} id - The admin id
 * @param {Object} body
 * @returns {Promise<Object>} - The updated admin object
 */
module.exports.updateProfile = async (id, body) =>
  await Admin.findByIdAndUpdate(id, body, { new: true })
    .select("-password")
    .lean({
      virtuals: true
    });

/**
 * @async
 * @description - Create a new assistant
 * @param  {Object} assistant
 * @returns {Promise<Object>} - The assistant object
 */
module.exports.createAssistant = async assistant =>
  await Admin.create(assistant);
