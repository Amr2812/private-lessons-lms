const { studentService } = require("../services");
const boom = require("@hapi/boom");
const multer = require("multer");

const { createGCStorage } = require("../config/multer");

module.exports.updateProfileImage = multer({
  storage: createGCStorage({
    destination: (req, file, cb) => {
      cb(null, { name: req.user.id, folder: "students" });
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes("image/"))
      return cb(boom.badRequest("Invalid file type"));

    cb(null, true);
  }
});

/**
 * @async
 * @description get student profile
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getProfile = async (req, res, next) => {
  const profile = await studentService.getProfile(req.user.id);

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
  const students = await studentService.getStudents(req.query);

  if (!students) return next(boom.notFound("No Results Found"));

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
  const student = await studentService.getProfile(req.params.id);

  if (!student) {
    return next(boom.notFound("Student not found"));
  }

  res.send(student);
};
