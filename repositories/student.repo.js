const { Student } = require("../models");

/**
 * @async
 * @description - This function is used to get all students
 * @returns {Promise<Array>} - Array of student objects
 */
module.exports.getStudents = async () =>
  await Student.find({}, { password: 0 }).lean();

/**
 * @async
 * @description - This function is used to get a student by id
 * @param {string} id - The id of the student
 * @param {boolean} [withPassword=true] - Whether to include the password in the response
 * @returns {Promise<Object>} - The student object
 */
module.exports.getStudentById = async (id, withPassword = true) => {
  if (withPassword) return await Student.findById(id).lean();

  return await Student.findById(id, { password: 0 }).lean();
};

/**
 * @async
 * @description - This function is used to get a student by email
 * @param {string} email - The email of the student
 * @returns {Promise<Object>} - The student object
 */
module.exports.getStudentByEmail = async email =>
  await Student.findOne({ email }).lean();

/**
 * @async
 * @description - This function is used to create a new student
 * @param {object} student - The student object
 * @returns {Promise<Object>} - The student object
 */
module.exports.createStudent = async student => {
  try {
    console.log(student);
    const s = await Student.create(student);
    console.log(s);
  } catch (error) {
    console.log(error);
  }
};

/**
 * @async
 * @description - This function is used to update a student
 * @param {string} id - The id of the student
 * @param {object} student - The student object
 * @returns {Promise<Object>} The student object
 */
module.exports.updateStudent = async (id, student) =>
  await Student.findByIdAndUpdate(id, student, { new: true })
    .select({ password: 0 })
    .lean();

/**
 * @async
 * @description - This function is used to delete a student
 * @param {string} id - The id of the student
 * @returns {Promise<Object>} - The student object
 */
module.exports.deleteStudent = async id =>
  await Student.findByIdAndDelete(id).lean();
