const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const validate = require("../../middlewares/validator");
const {
  requireAuth,
  requireInstructor,
  requireAdmin
} = require("../../middlewares/auth");
const { quizValidator } = require("../../validations");
const { quizController } = require("../../controllers");

router
  .route("/")
  .post(
    requireAdmin,
    validate(quizValidator.createQuiz),
    asyncMiddleware(quizController.createQuiz)
  )
  .get(
    requireAuth,
    validate(quizValidator.getQuizzes),
    asyncMiddleware(quizController.getQuizzes)
  );

router
  .route("/:id")
  .get(
    requireAuth,
    validate(quizValidator.getQuiz),
    asyncMiddleware(quizController.getQuiz)
  );

router
  .route("/:id/publish")
  .put(
    requireAdmin,
    validate(quizValidator.publishQuiz),
    asyncMiddleware(quizController.publishQuiz)
  );

router
  .route("/:id/unpublish")
  .put(
    requireInstructor,
    validate(quizValidator.unpublishQuiz),
    asyncMiddleware(quizController.unpublishQuiz)
  );

router
  .route("/:id/take")
  .post(
    requireAuth,
    validate(quizValidator.takeQuiz),
    asyncMiddleware(quizController.takeQuiz)
  );

router
  .route("/:id/check-answers")
  .post(
    requireAuth,
    validate(quizValidator.checkAnswers),
    asyncMiddleware(quizController.checkAnswers)
  );

module.exports = router;
