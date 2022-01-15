const { Student } = require("../models");

/**
 * @async
 * @description get all students
 * @param {String} id - Student id
 * @returns {Promise<Object[]>}
 */
module.exports.getProfile = async id =>
  await Student.findById(id, "-password")
    .populate("grade")
    .populate({
      path: "lessonsAttended",
      select: "title"
    })
    .lean({ virtuals: true });

/**
 * @async
 * @description get all students
 * @param {Object} query - Query object (grade, q, lessonNotAttended, lessonAttended. skip, limit)
 * @returns {Promise<Object[]>}
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
