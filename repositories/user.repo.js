const { User } = require("../models");

/**
 * @async
 * @description - This function is used to get all users
 * @returns {Promise<Array>} - Array of user objects
 */
module.exports.getUsers = async () =>
  await User.find({}, { password: 0 }).lean();

/**
 * @async
 * @description - This function is used to get a user by id
 * @param {string} id - The id of the user
 * @param {boolean} [withPassword=true] - Whether to include the password in the response
 * @returns {Promise<Object>} - The user object
 */
module.exports.getUserById = async (id, withPassword = true) => {
  if (withPassword) return await User.findById(id).lean();

  return await User.findById(id, { password: 0 }).lean();
};

/**
 * @async
 * @description - This function is used to get a user by email
 * @param {string} email - The email of the user
 * @returns {Promise<Object>} - The user object
 */
module.exports.getUserByEmail = async email =>
  await User.findOne({ email }).lean();

/**
 * @async
 * @description - This function is used to create a new user
 * @param {object} user - The user object
 * @returns {Promise<Object>} - The user object
 */
module.exports.createUser = async user => await User.create(user);

/**
 * @async
 * @description - This function is used to update a user
 * @param {string} id - The id of the user
 * @param {object} user - The user object
 * @returns {Promise<Object>} The user object
 */
module.exports.updateUser = async (id, user) =>
  await User.findByIdAndUpdate(id, user, { new: true })
    .select({ password: 0 })
    .lean();

/**
 * @async
 * @description - This function is used to delete a user
 * @param {string} id - The id of the user
 * @returns {Promise<Object>} - The user object
 */
module.exports.deleteUser = async id => await User.findByIdAndDelete(id).lean();
