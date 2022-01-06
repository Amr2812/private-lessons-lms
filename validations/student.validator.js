const { param, query } = require("express-validator");

module.exports.getStudent = [param("id").isMongoId().withMessage("Invalid id")];

module.exports.getStudents = [
  param("grade").isMongoId().withMessage("Invalid grade"),
  query("skip").optional().isInt({ min: 0 }).withMessage("Invalid skip"),
  query("limit").optional().isInt({ min: 0 }).withMessage("Invalid limit")
];
