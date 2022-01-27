const { body } = require("express-validator");

module.exports.updateProfile = [
  body("email").optional().isEmail().withMessage("Email is not valid"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
];

module.exports.createAssistant = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
];
