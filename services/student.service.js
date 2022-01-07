const { upload } = require("./storage.service");
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
 * @param {Object} query - Query object (grade, q, lessonNotAttended, skip, limit)
 * @returns {Promise<Object[]>}
 */
module.exports.getStudents = async ({
  grade,
  q,
  lessonNotAttended,
  skip,
  limit
}) => {
  const query = {};
  const scoreSort = {};

  if (grade) query.grade = grade;
  if (lessonNotAttended)
    query.lessonsAttended =  { $ne: lessonNotAttended  };

  if (q) {
    query.$text = { $search: q };
    scoreSort.score = { $meta: "textScore" };
  }

  const students = await Student.find(query, scoreSort)
    .sort(scoreSort)
    .skip(skip || 0)
    .limit(limit || 10)
    .select("name phone parentPhone grade")
    .populate({ path: "grade", select: "name" })
    .lean({ virtuals: true });

  const total = await Student.countDocuments(query);

  return { students, total };
};

/**
 * @async
 * @description Upload student profile image
 * @param {Object} student - Student object
 * @param {Object} file - File object
 * @returns {Promise<String>} - Profile image link
 */
module.exports.updateProfileImage = async (student, file) =>
  await upload(file, student.id, "students");
