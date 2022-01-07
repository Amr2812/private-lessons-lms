const { param, query } = require("express-validator");

module.exports.getStudent = [param("id").isMongoId().withMessage("Invalid id")];

module.exports.getStudents = [
  query("grade").optional().isMongoId().withMessage("Invalid grade"),
  query("q").optional().isString().withMessage("Invalid query"),
  query("lessonNotAttended").optional().isMongoId().withMessage("Invalid lesson"),
  query("skip").optional().isInt({ min: 0 }).withMessage("Invalid skip").toInt(),
  query("limit").optional().isInt({ min: 0 }).withMessage("Invalid limit").toInt()
];
