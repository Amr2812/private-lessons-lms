const { Action } = require("../models");

/**
 * @async
 * @description Record an action
 * @param {String} admin - Admin id
 * @param {String} grade - Grade id
 * @param {Number} count - Number of access codes generated
 * @param {String} type - Type of access codes generated
 * @returns {Promise<Object>} - The action object
 */
module.exports.recordAction = async (admin, grade, count, type) =>
  await Action.create({
    admin,
    grade,
    count,
    type
  });

/**
 * @async
 * @description Get all actions
 * @param {Object} query
 * @param {String} [query.type] - type of action lesson or quiz
 * @param {Number} [query.skip=0] - skip
 * @param {Number} [query.limit=10] - limit
 * @returns {Promise<Object>} { actions, total }
 */
module.exports.getActions = async ({ type, skip, limit }) => {
  let query = {};
  if (type) {
    query.type = type;
  }

  const total = await Action.countDocuments(query);
  if (total < 1) {
    return { actions: [], total };
  }

  const actions = await Action.find(query)
    .sort({ createdAt: -1 })
    .skip(skip || 0)
    .limit(limit || 10)
    .populate({
      path: "admin",
      select: "name"
    })
    .populate({
      path: "grade",
      select: "name"
    })
    .lean();

  return { actions, total };
};
