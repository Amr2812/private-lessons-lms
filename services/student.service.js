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
    .lean();

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
 * @description get a student
 * @returns {Promise<Object>}
 */
module.exports.getStudent = async id => {
  return await Student.findById(id, "-password").lean();
};

/**
 * @async
 * @description Upload student profile image
 * @param {Object} student - Student object
 * @param {Object} file - File object
 * @returns {Promise<Object>} student - Updated Student
 */
module.exports.updateProfileImage = async (student, file) => {
  const studentId = student._id.toString();
  const imgLink = await upload(file, studentId, "students");

  student.imageUrl = imgLink;
  return await Student.findByIdAndUpdate(id, student, { new: true })
    .select("-password")
    .lean();
};
