const { Action } = require("../models");

/**
 * @async
 * @description Record an action
 * @param {String} admin - Admin id
 * @param {String} grade - Grade id
 * @param {Number} count - Number of access codes generated
 * @returns {Promise<Object>} - The action object
 */
module.exports.recordAction = async (admin, grade, count) =>
  await Action.create({
    admin,
    grade,
    count
  });

/**
 * @async
 * @description Get all actions
 * @param {Object} query - Query object (skip, limit)
 * @returns {Promise<Object[]>} actions
 */
module.exports.getActions = async query =>
  await Action.find({})
    .skip(query.skip || 0)
    .limit(query.limit || 10)
    .populate({
      path: "admin",
      select: "name"
    })
    .populate({
      path: "grade",
      select: "name"
    })
    .sort({ date: -1 })
    .lean();
