const { AccessCode } = require("../models");
const { nanoid } = require("nanoid/async");

/**
 * @async
 * @description Generate access codes for a grade
 * @param {String} grade - grade id
 * @param {Number} count - number of access codes to generate
 * @param {String} type - type of access code
 * @returns {Promise<String[]>} access codes
 */
module.exports.generateAccessCodes = async (grade, count, type) => {
  let accessCodes;
  try {
    accessCodes = await Promise.all(
      Array.from({ length: count }, async () => {
        return {
          code: await nanoid(8),
          grade,
          type
        };
      })
    );

    await AccessCode.insertMany(accessCodes);

    return accessCodes.map(code => code.code);
  } catch (err) {
    if (err.code === 11000) {
      return accessCodes.slice(0, err.result.nInserted).map(code => code.code);
    }

    throw err;
  }
};
