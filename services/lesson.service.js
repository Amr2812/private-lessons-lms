const boom = require("@hapi/boom");
const { constants } = require("../config/constants");
const { Lesson, AccessCode, Student } = require("../models");
const { getSignedUrl } = require("./storage.service");
const { isInstructor } = require("./admin.service");
const { isStudent } = require("./student.service");
const { events, subscribers } = require("../events");

/**
 * @async
 * @description create a new lesson
 * @param {Oject} lesson
 * @returns {Promise<Object>} - Lesson
 */
module.exports.createLesson = async lesson => {
  let createdLesson = await Lesson.create(lesson);
  createdLesson = createdLesson.toJSON();

  createdLesson.uploadUrl = await getSignedUrl(
    constants.STUDENTS_FOLDER,
    createdLesson.videoName,
    constants.MAX_SIGNED_URL_EXPIRATION
  );

  return createdLesson;
};

/**
 * @async
 * @description get lessons
 * @param {Object} user - User
 * @param {Object} query
 * @param {String} query.grade - grade id
 * @param {Boolean} [query.isPublished=true]
 * @param {String} [query.q] - search query
 * @param {Number} [query.skip]
 * @param {Number} [query.limit]
 * @returns {Promise<Object>} - { lessons, total }
 */
module.exports.getLessons = async (
  user,
  { grade, isPublished, q, skip, limit }
) => {
  let query = { grade, isPublished: true };
  let sort = { createdAt: 1 };

  if (isInstructor(user)) {
    if (isPublished !== undefined) {
      query.isPublished = isPublished;
    } else {
      query.isPublished = true;
    }
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
 * @param {Object} user - User
 * @param {String} id - Lesson id
 * @param {Boolean} [videoName=false] - wether to return videoName or not
 * @returns {Promise<Object>} - Lesson
 */
module.exports.getLesson = async (user, id, videoName = false) => {
  if (!this.attendedLesson(user, id)) {
    return boom.badRequest("You have to attend this lesson to view it");
  }

  const lesson = await Lesson.findOne({ _id: id })
    .populate({ path: "grade", select: "name" })
    .lean();

  if (!lesson) return boom.notFound("Lesson not found");

  if (!lesson.isPublished && user.role !== constants.ROLES_ENUM.instructor) {
    return boom.notFound("Lesson not published");
  }

  if (!videoName) {
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
module.exports.publishLesson = async id => {
  const lesson = await Lesson.findByIdAndUpdate(
    id,
    { isPublished: true },
    { new: true }
  );

  if (!lesson) {
    return boom.notFound("Lesson not found");
  }

  subscribers.lessonSubscriber.emit(events.LESSON_PUBLISHED, lesson);

  return lesson;
};

/**
 * @async
 * @description Un Publish lesson
 * @param {String} id - Lesson id
 * @returns {Promise<Object>} - Lesson
 */
module.exports.unpublishLesson = async id => {
  const res = await Lesson.updateOne({ _id: id }, { isPublished: true });

  if (res.matchedCount < 1) {
    return boom.notFound("Quiz not found");
  }

  return res;
};

/**
 * @async
 * @description Attend lesson
 * @param {String} user - user object
 * @param {String} lessonId - Lesson id
 * @param {String} code - Access code
 * @returns {Promise<Object>} - Lesson
 */
module.exports.attendLesson = async (user, lessonId, code) => {
  if (!isStudent(user)) {
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
  if (accessCode.type !== "lesson")
    return boom.badRequest("Access code is not for lessons");

  if (this.attendedLesson(user, lessonId)) {
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

/**
 * @description check if student has attended lesson
 * @param {Object} user - user object
 * @param {String} lessonId - Lesson id
 * @returns {Boolean} - true if student has attended lesson
 */
module.exports.attendedLesson = (user, lessonId) =>
  isStudent(user) && user.lessonsAttended.includes(lessonId);
