const { userRepo } = require("../repositories");

/**
 * @async
 * @description Signup a new user
 * @param {Object} user 
 * @returns {Promise<Object>}
 */
module.exports.signup = async user => {
  const createdUser = await userRepo.createUser(user);
  createdUser.password = undefined;

  return createdUser;
};
