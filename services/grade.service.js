const { Grade } = require("../models");

/**
 * @async
 * @description Create a grade
 * @param {String} name - Grade name
 * @returns {Promise<Object>} - Grade
 */
module.exports.createGrade = async name => await Grade.create({ name });

/**
 * @async
 * @description Get all grades
 * @returns {Promise<Object[]>} - grades
 */
module.exports.getGrades = async () =>
  await Grade.find({}).select("-accessCodes").lean();

/**
 * @async
 * @description Update a grade
 * @param {String} id - Grade id
 * @param {Object} grade - Grade
 * @returns {Promise<Object>} grade - The updated grade
 */
module.exports.updateGrade = async (id, grade) =>
  await Grade.findByIdAndUpdate(id, grade, {
    new: true,
    runValidators: true,
    context: "query"
  })
    .select("-accessCodes")
    .lean();
