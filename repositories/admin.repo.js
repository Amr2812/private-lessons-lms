const { Admin } = require("../models");

/**
 * @async
 * @description - This function is used to get all admins
 * @returns {Promise<Array>} - Array of admin objects
 */
module.exports.getAdmins = async () =>
  await Admin.find({}, { password: 0 }).lean();

/**
 * @async
 * @description - This function is used to get a admin by id
 * @param {string} id - The id of the admin
 * @param {boolean} [withPassword=true] - Whether to include the password in the response
 * @returns {Promise<Object>} - The admin object
 */
module.exports.getAdminById = async (id, withPassword = true) => {
  if (withPassword) return await Admin.findById(id).lean();

  return await Admin.findById(id, { password: 0 }).lean();
};

/**
 * @async
 * @description - This function is used to get a admin by email
 * @param {string} email - The email of the admin
 * @returns {Promise<Object>} - The admin object
 */
module.exports.getAdminByEmail = async email =>
  await Admin.findOne({ email }).lean();

/**
 * @async
 * @description - This function is used to create a new admin
 * @param {object} admin - The admin object
 * @returns {Promise<Object>} - The admin object
 */
module.exports.createAdmin = async admin => await Admin.create(admin);

/**
 * @async
 * @description - This function is used to update a admin
 * @param {string} id - The id of the admin
 * @param {object} admin - The admin object
 * @returns {Promise<Object>} The admin object
 */
module.exports.updateAdmin = async (id, admin) =>
  await Admin.findByIdAndUpdate(id, admin, { new: true })
    .select({ password: 0 })
    .lean();

/**
 * @async
 * @description - This function is used to delete a admin
 * @param {string} id - The id of the admin
 * @returns {Promise<Object>} - The admin object
 */
module.exports.deleteAdmin = async id =>
  await Admin.findByIdAndDelete(id).lean();
