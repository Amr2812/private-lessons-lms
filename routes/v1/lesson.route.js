const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const {
  requireAuth,
  requireInstructor,
  requireAdmin
} = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");

const { lessonValidator } = require("../../validations");
const { lessonController } = require("../../controllers");

router
  .route("/")
  .post(
    requireInstructor,
    validate(lessonValidator.createLesson),
    asyncMiddleware(lessonController.createLesson)
  )
  .get(
    requireAuth,
    validate(lessonValidator.getLessons),
    asyncMiddleware(lessonController.getLessons)
  );

router
  .route("/:id")
  .get(
    requireAuth,
    validate(lessonValidator.getLesson),
    asyncMiddleware(lessonController.getLesson)
  );

router
  .route("/:id/publish")
  .put(
    requireInstructor,
    validate(lessonValidator.publishLesson),
    asyncMiddleware(lessonController.publishLesson)
  );

router
  .route("/:id/unpublish")
  .put(
    requireInstructor,
    validate(lessonValidator.unpublishLesson),
    asyncMiddleware(lessonController.unpublishLesson)
  );

router.route("/:id/video").get(asyncMiddleware(lessonController.streamVideo));

router
  .route("/:id/attend")
  .post(
    requireAuth,
    validate(lessonValidator.attendLesson),
    asyncMiddleware(lessonController.attendLesson)
  );

module.exports = router;
