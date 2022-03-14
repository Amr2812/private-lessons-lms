const { constants } = require("../config/constants");
const boom = require("@hapi/boom");
const { Student } = require("../models");

/**
 * @async
 * @description get student profile
 * @param {String} id - Student id
 * @returns {Promise<Object>}
 */
module.exports.getProfile = async id => {
  const profile = await Student.findById(id, "-password")
    .populate("grade")
    .populate({
      path: "lessonsAttended",
      select: "title"
    })
    .lean({ virtuals: true });

  if (!profile) {
    return boom.notFound("Profile not found");
  }

  return profile;
};

/**
 * @async
 * @description update student profile
 * @param {Object} id - Student ID
 * @param {Object} body - Student body
 * @returns {Promise<Object>} Updated student profile
 */
module.exports.updateProfile = async (id, body) =>
  await Student.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    context: "query"
  })
    .select("-password -lessonsAttended")
    .lean({ virtuals: true });

/**
 * @async
 * @description Update student FCM token
 * @param {Object} user - Student object
 * @param {Object} body - Req object
 * @param {String} body.fcmToken - FCM Token to add
 * @param {String} body.oldFCMToken - Old FCM Token to remove
 * @returns {Promise<String[]>} Updated student fcm tokens
 */
module.exports.updateFcmToken = async (user, { fcmToken, oldFcmToken }) => {
  if (oldFcmToken && user.fcmTokens.includes(oldFcmToken)) {
    user.fcmTokens = user.fcmTokens.filter(token => token !== oldFcmToken);
  }

  if (fcmToken && !user.fcmTokens.includes(fcmToken)) {
    user.fcmTokens.push(fcmToken);
  }

  await Student.updateOne({ _id: user.id }, { fcmTokens: user.fcmTokens });

  return user.fcmTokens;
};

/**
 * @async
 * @description get all students
 * @param {Object} query
 * @param {String} query.grade - grade id
 * @param {String} query.q - search query
 * @param {String} query.lessonNotAttended - lesson not attended by students
 * @param {String} query.lessonAttended - lesson attended by students
 * @param {Number} [query.skip=0]
 * @param {Number} [query.limit=10]
 * @returns {Promise<Object[]>} { students, total }
 */
module.exports.getStudents = async ({
  grade,
  q,
  lessonNotAttended,
  lessonAttended,
  skip,
  limit
}) => {
  const query = {};
  const scoreSort = {};

  if (grade) query.grade = grade;
  if (lessonNotAttended) query.lessonsAttended = { $ne: lessonNotAttended };

  if (lessonAttended) query.lessonsAttended = lessonAttended;

  if (q) {
    query.$text = { $search: q };
    scoreSort.score = { $meta: "textScore" };
  }

  const total = await Student.countDocuments(query);
  if (total < 1) {
    return { students: [], total };
  }

  const students = await Student.find(query, scoreSort)
    .sort(scoreSort)
    .skip(skip || 0)
    .limit(limit || 10)
    .select("name phone parentPhone grade")
    .populate({ path: "grade", select: "name" })
    .lean({ virtuals: true });

  return { students, total };
};

/**
 * @description check if user is student
 * @param {Object} user
 * @param {String} user.role
 * @returns {Boolean}
 */
module.exports.isStudent = ({ role }) => role === constants.ROLES_ENUM.student;
