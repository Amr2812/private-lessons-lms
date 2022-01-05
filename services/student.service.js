const { upload } = require("./storage.service");
const { Student } = require("../models");

/**
 * @async
 * @description get all students
 * @param {String} id - Student id
 * @returns {Promise<Object[]>}
 */
module.exports.getProfile = async id =>
  await Student.findById(id, "-password")
    .populate("grade")
    .populate({
      path: "lessonsAttended",
      select: "title"
    })
    .lean({ virtuals: true });

/**
 * @async
 * @description get all students
 * @returns {Promise<Object[]>}
 */
module.exports.getStudents = async () => {
  return await Student.find({}, "-password").lean();
};

/**
 * @async
 * @description Upload student profile image
 * @param {Object} student - Student object
 * @param {Object} file - File object
 * @returns {Promise<String>} - Profile image link
 */
module.exports.updateProfileImage = async (student, file) =>
  await upload(file, student.id, "students");
