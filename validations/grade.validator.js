const { body, param } = require("express-validator");

module.exports.createGrade = [
  body("name").isLength({ min: 1 }).withMessage("Name is required")
];

module.exports.updateGrade = [
  param("id").isMongoId().withMessage("Invalid id"),
  body("name").isLength({ min: 1 }).withMessage("Name is required")
];
