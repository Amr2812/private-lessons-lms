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
