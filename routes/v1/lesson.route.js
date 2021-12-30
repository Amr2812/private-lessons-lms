const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const { requireAuth, requireInstructor } = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");
const formidable = require("express-formidable");

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
  .route("/:id/video")
  .put(
    requireInstructor,
    formidable(),
    asyncMiddleware(lessonController.updateVideo)
  );

module.exports = router;
