const { body, query, param } = require("express-validator");
const { removeArrayDuplicates } = require("../utils");

module.exports.createQuiz = [
  body("title").notEmpty().withMessage("Title is required"),
  body("grade").isMongoId().withMessage("Grade is required"),
  body("questions")
    .isArray()
    .withMessage("Questions are required")
    .customSanitizer(removeArrayDuplicates),
  body("questions.*.question").notEmpty().withMessage("Question is required"),
  body("questions.*.answers")
    .isArray({ min: 2 })
    .withMessage("Answers should be at least two"),
  body("questions.*.correctAnswer")
    .notEmpty()
    .withMessage("Correct answer is required")
    .custom((value, { req }) => {
      const question = req.body.questions.find(
        question => question.correctAnswer === value
      );

      if (!question.answers.includes(value)) {
        throw new Error("Correct answer should be one of the given answers");
      }

      return true;
    })
];

module.exports.getQuizzes = [
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

module.exports.getQuiz = [
  param("id").isMongoId().withMessage("Id is required")
];

module.exports.updateQuestion = [
  param("quizId").isMongoId().withMessage("Quiz Id is required"),
  param("questionId").isMongoId().withMessage("Question Id is required"),
  body("question").notEmpty().withMessage("Question is required"),
  body("answers")
    .isArray({ min: 2 })
    .withMessage("Answers should be at least two"),
  body("correctAnswer")
    .notEmpty()
    .withMessage("Correct answer is required")
    .custom((value, { req }) => {
      if (!req.body.answers.includes(value)) {
        throw new Error("Correct answer should be one of the given answers");
      }

      return true;
    })
];

module.exports.publishQuiz = [
  param("id").isMongoId().withMessage("Id is required")
];

module.exports.unpublishQuiz = [
  param("id").isMongoId().withMessage("Id is required")
];

module.exports.takeQuiz = [
  param("id").isMongoId().withMessage("Id is required"),
  body("code").isLength({ min: 8 }).withMessage("Code is required")
];

module.exports.checkAnswers = [
  param("id").isMongoId().withMessage("Id is required"),
  body("answers")
    .isArray()
    .isLength({ min: 1 })
    .withMessage("Answers should at least have one answer")
    .customSanitizer(removeArrayDuplicates),
  body("answers.*.answer").notEmpty().withMessage("Answer is required"),
  body("answers.*.id").notEmpty().withMessage("Question Id is required")
];
