const { Lesson, AccessCode, Student } = require("../models");
const { upload } = require("./storage.service");
const boom = require("@hapi/boom");
const { bucket } = require("../config/firebase");

/**
 * @async
 * @description create a new lesson
 * @param {Oject} lesson
 * @returns {Promise<Object>}
 */
module.exports.createLesson = async lesson => await Lesson.create(lesson);

/**
 * @async
 * @description update video
 * @param {String} id - Lesson id
 * @param {Object} file - File object
 * @returns {Promise<Object>}
 */
module.exports.updateVideo = async (id, file) => {
  const videoLink = await upload(file, id, "lessons");

  return await Lesson.findByIdAndUpdate(
    id,
    { videoLink },
    { new: true }
  ).lean();
};

/**
 * @async
 * @description get lessons
 * @param {String} grade - Grade id
 * @param {Object} query - Query object
 * @returns {Promise<Object>} - (lessons, total)
 */
module.exports.getLessons = async (grade, query) => {
  const lessons = await Lesson.find({ grade })
    .sort({ date: 1 })
    .skip(query.skip || 0)
    .limit(query.limit || 10)
    .select("title")
    .lean();

  const total = await Lesson.countDocuments({ grade });

  return { lessons, total };
};

/**
 * @async
 * @description Get lesson by id
 * @param {String} id - Lesson id
 * @returns {Promise<Object>} - Lesson
 */
module.exports.getLesson = async id =>
  await Lesson.findById(id)
    .select("-videoLink")
    .populate({ path: "grade", select: "name" })
    .lean();

/**
 * @async
 * @description Attend lesson
 * @param {String} student - student object
 * @param {String} lessonId - Lesson id
 * @param {String} code - Access code
 * @returns {Promise<Object>} - Lesson
 */
module.exports.attendLesson = async (student, lessonId, code) => {
  const lesson = await Lesson.findById(lessonId).select("-videoLink").lean();
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
    { _id: student._id },
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
