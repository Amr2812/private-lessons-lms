const { body } = require("express-validator");

module.exports.studentSignup = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("phone").isInt().withMessage("Phone must be a number").isLength({ min: 6 }).withMessage("Phone must be at least 6 characters long"),
  body("parentPhone").isInt().withMessage("Phone must be a number").isLength({ min: 6 }).withMessage("Phone must be at least 6 characters long"),
  body("grade").notEmpty().withMessage("Grade ID is required"),
];

module.exports.studentLogin = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];

module.exports.adminLogin = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];
