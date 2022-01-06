const { AccessCode } = require("../models");
const { nanoid } = require("nanoid/async");

/**
 * @async
 * @description Generate access codes for a grade
 * @param {String} grade - grade id
 * @param {Number} count - number of access codes to generate
 * @returns {Promise<String[]>} access codes
 */
module.exports.generateAccessCodes = async (grade, count) => {
  let accessCodes = [];
  try {
    for (let i = 0; i < count; i++) {
      accessCodes.push({
        code: await nanoid(8),
        grade
      });
    }

    await AccessCode.insertMany(accessCodes);
    return accessCodes.map(code => code.code);
  } catch (err) {
    if (err.code === 11000) {
      return accessCodes.slice(0, err.result.nInserted).map(code => code.code);
    }

    throw err;
  }
};
