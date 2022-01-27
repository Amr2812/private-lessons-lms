const { param, query } = require("express-validator");
const { constants } = require("../config/constants");

module.exports.generateAccessCodes = [
  param("gradeId").isMongoId().withMessage("Grade ID is invalid"),
  query("count")
    .isInt({ min: 1, max: constants.MAX_ACCESS_CODES_PER_REQUEST })
    .withMessage(
      `Count must be a positive integer maximum ${constants.MAX_ACCESS_CODES_PER_REQUEST}`
    )
    .toInt()
];
