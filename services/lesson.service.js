const { Lesson, AccessCode, Student } = require("../models");
const { getSignedUrl } = require("./storage.service");
const { sendToTopic } = require("./notification.service");
const { sendEmail } = require("./mail.service");
const { templates } = require("../config/sendGrid");
const { constants, env } = require("../config/constants");
const logger = require("../config/logger");

const boom = require("@hapi/boom");
const { EventEmitter } = require("events");

/**
 * @async
 * @description create a new lesson
 * @param {Oject} lesson
 * @returns {Promise<Object>}
 */
module.exports.createLesson = async lesson => {
  let createdLesson = await Lesson.create(lesson);
  createdLesson = createdLesson.toJSON();

  createdLesson.uploadUrl = await getSignedUrl(
    constants.STUDENTS_FOLDER,
    createdLesson.videoName,
    constants.MAX_SIGNED_URL_EXPIRATION
  );

  createdLesson.password = undefined;
  return createdLesson;
};

/**
 * @async
 * @description get lessons
 * @param {String} queryParams - (Grade id, q)
 * @param {String} userRole - User role
 * @returns {Promise<Object>} - (lessons, total)
 */
module.exports.getLessons = async (
  { grade, isPublished, q, skip, limit },
  userRole
) => {
  let query = {};
  let sort = { createdAt: 1 };

  if (userRole !== constants.ROLES_ENUM.instructor) {
    query = {
      grade,
      isPublished: true
    };
  } else {
    query = {
      grade,
      isPublished
    };
  }

  if (q) {
    query.$text = { $search: q };
    sort = { score: { $meta: "textScore" } };
  }

  const total = await Lesson.countDocuments(query);
  if (total < 1) {
    return { lessons: [], total };
  }

  const lessons = await Lesson.find(query)
    .sort(sort)
    .skip(skip || 0)
    .limit(limit || 10)
    .select("title")
    .lean();

  return { lessons, total };
};

/**
 * @async
 * @description Get lesson by id
 * @param {String} id - Lesson id
 * @param {Object} user - User
 * @param {Boolean} videoName - wether to return videoName or not
 * @returns {Promise<Object>} - Lesson
 */
module.exports.getLesson = async (id, user, videoName = false) => {
  if (
    user.role === constants.ROLES_ENUM.student &&
    !user.lessonsAttended.includes(id)
  ) {
    return boom.badRequest("You have to attend this lesson to view it");
  }

  const lesson = await Lesson.findById(id)
    .populate({ path: "grade", select: "name" })
    .lean();

  if (!lesson) return boom.notFound("Lesson not found");

  if (!lesson.isPublished && user.role !== constants.ROLES_ENUM.instructor) {
    return boom.notFound("Lesson not published");
  }

  if (!lesson.videoName) {
    lesson.videoName = undefined;
  }

  return lesson;
};

/**
 * @async
 * @description Publish lesson
 * @param {String} id - Lesson id
 * @returns {Promise<Object>} - Lesson
 */
module.exports.publishLesson = async id =>
  await Lesson.findByIdAndUpdate(id, { isPublished: true }, { new: true })
    .select("-videoName")
    .lean();

/**
 * @async
 * @description Un Publish lesson
 * @param {String} id - Lesson id
 * @returns {Promise<Object>} - Lesson
 */
module.exports.unpublishLesson = async id =>
  await Lesson.findByIdAndUpdate(id, { isPublished: false }, { new: true })
    .select("-videoName")
    .lean();

/**
 * @async
 * @description Attend lesson
 * @param {String} user - user object
 * @param {String} lessonId - Lesson id
 * @param {String} code - Access code
 * @returns {Promise<Object>} - Lesson
 */
module.exports.attendLesson = async (user, lessonId, code) => {
  if (user.role !== constants.ROLES_ENUM.student) {
    return boom.unauthorized("You have to be a student to attend a lesson");
  }

  const lesson = await Lesson.findOne({
    isPublished: true,
    _id: lessonId
  })
    .select("-videoName")
    .lean();

  if (!lesson) return boom.notFound("Lesson not found");

  const accessCode = await AccessCode.findOne({
    code,
    grade: lesson.grade
  });

  if (!accessCode) return boom.notFound("Access code not found");

  if (accessCode.consumed) return boom.badRequest("Access code already used");

  if (user.lessonsAttended.includes(lessonId)) {
    return boom.badRequest(
      "You already attended this lesson you can access it"
    );
  }

  await Student.updateOne(
    { _id: user.id },
    {
      $push: {
        lessonsAttended: lessonId
      }
    }
  );

  accessCode.consumed = true;
  await accessCode.save({ validateBeforeSave: false });

  return lesson;
};

const eventEmitter = new EventEmitter();

eventEmitter.on("LESSON_PUBLISHED", async lesson => {
  try {
    await sendToTopic(String(lesson.grade), {
      notification: {
        title: "New Lesson Published",
        body: `${lesson.title} is now available for students to attend.`
      },
      data: {
        type: "lesson",
        id: lesson.id
      }
    });

    const students = await Student.find(
      {
        grade: lesson.grade
      },
      "email"
    ).lean();

    const emails = students.map(student => student.email);

    await sendEmail(emails, templates.NEW_LESSON_ALERT, {
      title: lesson.title,
      url: `${env.FRONTEND_URL}/lessons/${lesson.id}`
    });
  } catch (err) {
    logger.error(err);
  }
});

module.exports.eventEmitter = eventEmitter;
