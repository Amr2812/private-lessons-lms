const { Lesson, AccessCode, Student } = require("../models");
const { getSignedUrl } = require("./storage.service");
const { sendToTopic } = require("./notification.service");
const { constants, env } = require("../config/constants");
const boom = require("@hapi/boom");
const { EventEmitter } = require("events");
const { sendEmail } = require("./mail.service");

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
    "lessons",
    createdLesson.id,
    constants.MAX_SIGNED_URL_EXPIRATION
  );

  createdLesson.password = undefined;
  return createdLesson;
};

/**
 * @async
 * @description get lessons
 * @param {String} grade - Grade id
 * @param {String} userRole - User role
 * @param {Object} options - Options object (skip, limit)
 * @returns {Promise<Object>} - (lessons, total)
 */
module.exports.getLessons = async (grade, userRole, { skip, limit }) => {
  let query = {};
  if (!(userRole === "instructor")) {
    query = {
      isPublished: true,
      grade
    };
  } else {
    query = {
      grade
    };
  }

  const total = await Lesson.countDocuments(query);
  if (total < 1) {
    return { lessons: [], total };
  }

  const lessons = await Lesson.find(query)
    .sort({ date: 1 })
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
 * @returns {Promise<Object>} - Lesson
 */
module.exports.getLesson = async (id, user) => {
  if (user.role === "student") {
    if (!user.lessonsAttended.includes(req.params.id)) {
      return next(boom.badRequest("You have to attend this lesson to view it"));
    }
  }

  const lesson = await Lesson.findById(id)
    .populate({ path: "grade", select: "name" })
    .lean();

  if (!lesson) return boom.notFound("Lesson not found");

  if (!lesson.isPublished) {
    if (userRole !== "instructor") {
      return boom.notFound("Lesson not published");
    }
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
  await Lesson.findByIdAndUpdate(
    id,
    { isPublished: true },
    { new: true }
  ).lean();

/**
 * @async
 * @description Un Publish lesson
 * @param {String} id - Lesson id
 * @returns {Promise<Object>} - Lesson
 */
module.exports.unpublishLesson = async id =>
  await Lesson.findByIdAndUpdate(
    id,
    { isPublished: false },
    { new: true }
  ).lean();

/**
 * @async
 * @description Attend lesson
 * @param {String} user - user object
 * @param {String} lessonId - Lesson id
 * @param {String} code - Access code
 * @returns {Promise<Object>} - Lesson
 */
module.exports.attendLesson = async (user, lessonId, code) => {
  if (!(user.role === "student")) {
    return next(
      boom.unauthorized("You have to be a student to attend a lesson")
    );
  }

  const lesson = await Lesson.findOne({
    isPublished: true,
    _id: lessonId
  }).lean();

  if (!lesson) return next(boom.notFound("Lesson not found"));

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

    await sendEmail(emails, "New Lesson Published", "new_lesson_alert", {
      title: lesson.title,
      url: `${env.FRONTEND_URL}/lessons/${lesson.id}`
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports.eventEmitter = eventEmitter;
