const { param, query } = require("express-validator");

module.exports.generateAccessCodes = [
  param("gradeId").isMongoId().withMessage("Grade ID is invalid"),
  query("count")
    .isInt({ min: 1 })
    .withMessage("Count must be a positive integer")
    .toInt()
];
