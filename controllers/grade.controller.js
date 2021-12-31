const { gradeService } = require("../services");
const boom = require("@hapi/boom");

/**
 * @async
 * @description Create a grade
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
module.exports.createGrade = async (req, res, next) => {
  const grade = await gradeService.createGrade(req.body.name);
  res.status(201).send(grade);
};

/**
 * @async
 * @description Get all grades
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
module.exports.getGrades = async (req, res, next) => {
  const grades = await gradeService.getGrades();
  res.send(grades);
};

/**
 * @async
 * @description Update a grade
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
module.exports.updateGrade = async (req, res, next) => {
  const grade = await gradeService.updateGrade(req.params.id, req.body);
  res.send(grade);
};

/**
 * @async
 * @description Generate access codes for a grade
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
module.exports.generateAccessCodes = async (req, res, next) => {
  const codes = await gradeService.generateAccessCodes(req.params.id, req.query.count);

  if (!codes) return next(boom.notFound("Grade not found"));

  res.send(codes);
}
