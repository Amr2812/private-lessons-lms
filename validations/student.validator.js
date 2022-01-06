const { param } = require("express-validator");

module.exports.getStudent = [param("id").isMongoId().withMessage("Invalid id")];

module.exports.getStudents = [
  param("grade").isMongoId().withMessage("Invalid grade")
];
