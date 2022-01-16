const { Lesson, AccessCode, Student } = require("../models");
const { getSignedUrl } = require("./storage.service");
const boom = require("@hapi/boom");
const { constants } = require("../config/constants");

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
 * @param {String} userRole - User role
 * @returns {Promise<Object>} - Lesson
 */
module.exports.getLesson = async (id, userRole) => {
  let query = {};
  if (!(userRole === "instructor")) {
    query = {
      isPublished: true,
      _id: id
    };
  } else {
    query = {
      _id: id
    };
  }

  await Lesson.findOne(query)
    .populate({ path: "grade", select: "name" })
    .lean();
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
 * @param {String} student - student object
 * @param {String} lessonId - Lesson id
 * @param {String} code - Access code
 * @returns {Promise<Object>} - Lesson
 */
module.exports.attendLesson = async (student, lessonId, code) => {
  const lesson = await Lesson.findOne({
    isPublished: true,
    _id: lessonId
  }).lean();
  if (!lesson) return null;

  const accessCode = await AccessCode.findOne({
    code,
    grade: lesson.grade
  });

  if (!accessCode) return boom.notFound("Access code not found");

  if (accessCode.consumed) return boom.badRequest("Access code already used");

  if (student.lessonsAttended.includes(lessonId)) {
    return boom.badRequest(
      "You already attended this lesson you can access it"
    );
  }

  await Student.updateOne(
    { _id: student.id },
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

/**
 * @async
 * @description Check if lesson is isPublished
 * @param {String} id - Lesson id
 * @returns {Promise<Boolean>}
 */
module.exports.isLessonPublished = async id => {
  const lesson = await Lesson.findById(id).lean();
  if (!lesson) return false;
  return lesson.isPublished;
};
