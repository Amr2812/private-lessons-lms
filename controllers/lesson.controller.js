const { lessonService } = require("../services");

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
