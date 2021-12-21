const { upload } = require("./storage.service");
const { userRepo } = require("../repositories");

/**
 * @async
 * @description get all users
 * @returns {Promise<Object[]>}
 */
module.exports.getUsers = async () => {
  return await userRepo.getUsers();
};

/**
 * @async
 * @description get a user
 * @returns {Promise<Object>}
 */
module.exports.getUser = async id => {
  return await userRepo.getUserById(id, false);
};

/**
 * @async
 * @description Upload user profile image
 * @param {Object} user - User object
 * @param {Object} file - File object
 * @returns {Promise<String>} - Updated User
 */
module.exports.updateProfileImage = async (user, file) => {
  const userId = user._id.toString();
  const imgLink = await upload(file, userId, "users");
  console.log(imgLink);
  user.image_url = imgLink;
  return await userRepo.updateUser(userId, user);
};
