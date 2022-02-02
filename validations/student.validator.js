const { param, query, body } = require("express-validator");

module.exports.getStudent = [param("id").isMongoId().withMessage("Invalid id")];

module.exports.getStudents = [
  query("grade").optional().isMongoId().withMessage("Invalid grade"),
  query("q").optional().isString().withMessage("Invalid query"),
  query("lessonNotAttended")
    .optional()
    .isMongoId()
    .withMessage("Invalid lesson not attended"),
  query("lessonAttended")
    .optional()
    .isMongoId()
    .withMessage("Invalid lesson attended"),
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

module.exports.updateProfile = [
  body("email").optional().isEmail().withMessage("Email is not valid"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("phone")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Phone must be at least 6 characters long"),
  body("parentPhone")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Phone must be at least 6 characters long")
];

module.exports.updateFcmToken = [
  body("fcmToken").isString().withMessage("FCM Token is not valid"),
  body("oldFcmToken")
    .optional()
    .isString()
    .withMessage("FCM Token is not valid")
];
