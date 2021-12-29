const { studentService } = require("../services");
const boom = require("@hapi/boom");

/**
 * @async
 * @description get student profile
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getProfile = async (req, res, next) => {
  const profile = await studentService.getProfile(req.user._id);

  if (!profile) {
    return next(boom.notFound("Profile not found"));
  }

  res.send(profile);
};

/**
 * @async
 * @description get all students
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getStudents = async (req, res, next) => {
  const students = await studentService.getStudents();

  if (!students) {
    return next(boom.notFound("Students not found"));
  }

  res.send(students);
};

/**
 * @async
 * @description get a student
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getStudent = async (req, res, next) => {
  const student = await studentService.getStudent(req.params.id);

  if (!student) {
    return next(boom.notFound("Student not found"));
  }

  res.send(student);
};

/**
 * @async
 * @description put/update a student's profile picture
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.updateProfileImage = async (req, res, next) => {
  const file = req.files.file;
  if (!file) return next(boom.badRequest("No file uploaded"));

  if (!file.type.includes("image/"))
    return next(boom.badRequest("Invalid file type"));

  const student = await studentService.updateProfileImage(req.user, file);

  res.send(student);
};
