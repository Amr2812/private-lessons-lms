const { upload } = require("./storage.service");
const { studentRepo } = require("../repositories");

/**
 * @async
 * @description get all students
 * @param {String} id - Student id
 * @returns {Promise<Object[]>}
 */
module.exports.getProfile = async id =>
  await studentRepo.getStudentById(id, false);

/**
 * @async
 * @description get all students
 * @returns {Promise<Object[]>}
 */
module.exports.getStudents = async () => {
  return await studentRepo.getStudents();
};

/**
 * @async
 * @description get a student
 * @returns {Promise<Object>}
 */
module.exports.getStudent = async id => {
  return await studentRepo.getStudentById(id, false);
};

/**
 * @async
 * @description Upload student profile image
 * @param {Object} student - Student object
 * @param {Object} file - File object
 * @returns {Promise<String>} - Updated Student
 */
module.exports.updateProfileImage = async (student, file) => {
  const studentId = student._id.toString();
  const imgLink = await upload(file, studentId, "students");
  console.log(imgLink);
  student.image_url = imgLink;
  return await studentRepo.updateStudent(studentId, user);
};
