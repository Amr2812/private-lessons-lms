const { lessonService } = require("../services");
const { boom } = require("@hapi/boom");

/**
 * @async
 * @description create a new lesson
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.createLesson = async (req, res, next) => {
  const lesson = await lessonService.createLesson(req.body);
  res.status(201).send(lesson);
};

/**
 * @async
 * @description Update Video
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.updateVideo = async (req, res, next) => {
  const file = req.files.file;
  if (!file) return next(boom.badRequest("No file uploaded"));

  if (!file.type.includes("video/"))
    return next(boom.badRequest("Invalid file type"));

  const lesson = await lessonService.updateVideo(req.params.id, req.files.file);
  res.send(lesson);
};

/**
 * @async
 * @description Get Lessons
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getLessons = async (req, res, next) => {
  const lessons = await lessonService.getLessons(req.query.grade, {
    skip: req.query.skip,
    limit: req.query.limit
  });

  if (!lessons) return next(boom.notFound("Grade not found"));

  res.send(lessons);
};
