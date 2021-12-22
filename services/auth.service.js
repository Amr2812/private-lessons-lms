const { studentRepo } = require("../repositories");

/**
 * @async
 * @description Signup a new user
 * @param {Object} student - Student object
 * @returns {Promise<Object>}
 */
module.exports.signup = async student => {
  const createdStudent = await studentRepo.createStudent(student);
  createdStudent.password = undefined;

  return createdStudent;
};
