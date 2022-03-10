const { constants } = require("../config/constants");
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

/**
 * @description check if user is admin
 * @param {Object} user - { role }
 * @returns {Boolean}
 */
module.exports.isAdmin = ({ role }) =>
  constants.ADMINS_ROLES.includes(user.role);

/**
 * @description check if user is assistant
 * @param {Object} user - { role }
 * @returns {Boolean}
 */
module.exports.isAssistant = ({ role }) =>
  role === constants.ROLES_ENUM.assistant;

/**
 * @description check if user is instructor
 * @param {Object} user - { role }
 * @returns {Boolean}
 */
module.exports.isInstructor = ({ role }) =>
  role === constants.ROLES_ENUM.instructor;
