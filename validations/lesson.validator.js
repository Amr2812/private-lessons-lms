const { body, query, param } = require("express-validator");

module.exports.createLesson = [
  body("title").notEmpty().withMessage("Title is required"),
  body("grade").isMongoId().withMessage("Grade is required")
];

module.exports.getLessons = [
  query("grade").isMongoId().withMessage("Grade is required")
];

module.exports.getLesson = [
  param("id").isMongoId().withMessage("Id is required")
];

module.exports.attendLesson = [
  param("id").isMongoId().withMessage("Id is required"),
  body("code").isLength({ min: 8 }).withMessage("Code is required")
];