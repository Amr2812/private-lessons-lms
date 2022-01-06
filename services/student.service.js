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
 * @param {String} grade - Grade id
 * @param {Object} query - Query object
 * @returns {Promise<Object[]>}
 */
module.exports.getStudents = async (grade, query) => {
  const students = await Student.find({ grade })
    .sort({ date: 1 })
    .skip(query.skip || 0)
    .limit(query.limit || 10)
    .select("name phone parentPhone")
    .lean({ virtuals: true });

  const total = await Student.countDocuments({ grade });

  return { students, total };
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
