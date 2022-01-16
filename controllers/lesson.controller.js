const { lessonService, storageService } = require("../services");
const boom = require("@hapi/boom");

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
 * @description Get Lessons
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getLessons = async (req, res, next) => {
  const lessons = await lessonService.getLessons(
    req.query.grade,
    req.user.role,
    {
      skip: req.query.skip,
      limit: req.query.limit
    }
  );

  res.send(lessons);
};

/**
 * @async
 * @description Get Lesson
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getLesson = async (req, res, next) => {
  if (req.user.role === "student") {
    if (!req.user.lessonsAttended.includes(req.params.id)) {
      return next(boom.badRequest("You have to attend this lesson to view it"));
    }
  }

  const lesson = await lessonService.getLesson(req.params.id, req.user.role);

  if (!lesson)
    return next(boom.notFound("Lesson not found or no longer published"));

  res.send(lesson);
};

/**
 * @async
 * @description Publish Lesson
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.publishLesson = async (req, res, next) => {
  await lessonService.publishLesson(req.params.id);
  res.sendStatus(204);
};
/**
 * @async
 * @description Un Publish Lesson
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.unpublishLesson = async (req, res, next) => {
  await lessonService.unpublishLesson(req.params.id);
  res.sendStatus(204);
};


/**
 * @async
 * @description Attend Lesson
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.attendLesson = async (req, res, next) => {
  if (!(req.user.role === "student")) {
    return next(
      boom.unauthorized("You have to be a student to attend a lesson")
    );
  }

  const lesson = await lessonService.attendLesson(
    req.user,
    req.params.id,
    req.body.code
  );

  if (!lesson) return next(boom.notFound("Lesson not found"));

  if (lesson instanceof Error) return next(lesson);

  res.send(lesson);
};

/**
 * @async
 * @description Stream Lesson Video
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.streamVideo = async (req, res, next) => {
  const range = req.headers.range;
  if (!range) {
    return next(boom.badRequest("Range header is required"));
  }

  if (req.user.role === "student") {
    if (!req.user.lessonsAttended.includes(req.params.id)) {
      return next(boom.badRequest("You have to attend this lesson to view it"));
    }
  }

  if (!(req.user.role === "instructor")) {
    const isPublished = await lessonService.isLessonPublished(req.params.id);
    if (!isPublished) {
      return next(boom.badRequest("Lesson is not published"));
    }
  }

  const [metadata] = await storageService.getFileMetaData(
    "lessons",
    req.params.id
  );

  // Parse Range
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, metadata.size - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${metadata.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": metadata.contentType
  };

  res.writeHead(206, headers);

  const videoStream = await storageService.streamVideo(
    "lessons",
    req.params.id,
    {
      start,
      end
    }
  );

  videoStream.on("error", err => {
    console.error(err);
    next(boom.badImplementation("Somethong wrong happened", err));
  });

  videoStream.pipe(res);
};
