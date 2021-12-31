const { Grade } = require("../models");
const { nanoid } = require("nanoid/async");

/**
 * @async
 * @description Create a grade
 * @param {String} name - Grade name
 * @returns {Promise<Object>} - The grade object
 */
module.exports.createGrade = async name => await Grade.create({ name });

/**
 * @async
 * @description Get all grades
 * @returns {Promise<Object[]>} - The grade objects
 */
module.exports.getGrades = async () =>
  await Grade.find({}).select("-accessCodes").lean();

/**
 * @async
 * @description Update a grade
 * @param {String} id - Grade id
 * @param {Object} grade - Grade object
 * @returns {Promise<Object>} grade - The updated grade object
 */
module.exports.updateGrade = async (id, grade) =>
  await Grade.findByIdAndUpdate(id, grade, {
    new: true,
    runValidators: true,
    context: "query"
  })
    .select("-accessCodes")
    .lean();

/**
 * @async
 * @description Generate access codes for a grade
 * @param {String} id - Grade id
 * @param {Number} count - Number of access codes to generate
 * @returns {Promise<Object[]>} - The access code objects
 */
module.exports.generateAccessCodes = async (id, count) => {
  const accessCodes = [];
  for (let i = 0; i < count; i++) {
    accessCodes.push(await nanoid(8));
  }

  return await Grade.findByIdAndUpdate(
    id,
    { $push: { accessCodes } },
    { runValidators: true, context: "query", new: true }
  )
    .select("accessCodes")
    .lean();
};
