const { body } = require("express-validator");

module.exports.createLesson = [
  body("title").notEmpty().withMessage("Title is required"),
  body("grade").isMongoId().withMessage("Grade is required")
];
