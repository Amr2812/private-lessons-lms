const { Student } = require("../models");

/**
 * @async
 * @description Signup a new user
 * @param {Object} student - Student object
 * @returns {Promise<Object>}
 */
module.exports.signup = async student => {
  const createdStudent = await Student.create(student);
  createdStudent.password = undefined;

  return createdStudent;
};
