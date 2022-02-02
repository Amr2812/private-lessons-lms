const { body, param, query } = require("express-validator");
const { constants } = require("../config/constants");

module.exports.studentSignup = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("phone")
    .isLength({ min: 9 })
    .withMessage("Phone must be at least 9 characters long"),
  body("parentPhone")
    .isLength({ min: 9 })
    .withMessage("Parent Phone must be at least 9 characters long")
    .custom((value, { req }) => {
      if (value === req.body.phone) {
        throw new Error("Phone number and parent phone number cannot be same");
      }

      return true;
    }),
  body("grade").isMongoId().withMessage("Grade ID is required"),
  body("fcmToken").optional().isString().withMessage("FCM Token is not valid")
];

module.exports.login = [
  query("role").isIn(constants.ROLES).withMessage("Role is required"),
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fcmToken").optional().isString().withMessage("FCM Token is not valid")
];

module.exports.forgotPassword = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("role").isIn(constants.ROLES).withMessage("Account role is not valid")
];

module.exports.resetPassword = [
  param("resetPasswordToken")
    .isLength({ min: constants.RESET_PASSWORD_TOKEN_LENGTH })
    .withMessage("Reset password token is not valid"),
  body("role").isIn(constants.ROLES).withMessage("Account role is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];
