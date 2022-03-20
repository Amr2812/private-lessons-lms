const { body, query, param } = require("express-validator");

module.exports.createLesson = [
  body("title").notEmpty().withMessage("Title is required"),
  body("grade").isMongoId().withMessage("Grade is required")
];

module.exports.getLessons = [
  query("grade").isMongoId().withMessage("Grade is required"),
  query("isPublished")
    .optional()
    .isBoolean()
    .withMessage("Is Published is boolean"),
  query("q").optional().isString().withMessage("Query is string"),
  query("skip")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Invalid skip")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Invalid limit")
    .toInt()
];

module.exports.getLesson = [
  param("id").isMongoId().withMessage("Id is required")
];

module.exports.updateLesson = [
  param("id").isMongoId().withMessage("Id is required"),
  body("title")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Title cannot be empty"),
  body("grade")
    .optional()
    .isMongoId()
    .withMessage("Grade is not a valid ObjectID"),
  body("notes").optional().isString().withMessage("Notes is string")
];

module.exports.publishLesson = [
  param("id").isMongoId().withMessage("Id is required")
];

module.exports.unpublishLesson = [
  param("id").isMongoId().withMessage("Id is required")
];

module.exports.attendLesson = [
  param("id").isMongoId().withMessage("Id is required"),
  body("code").isLength({ min: 8 }).withMessage("Code is required")
];
