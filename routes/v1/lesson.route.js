const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const { requireAuth, requireInstructor } = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");

const { lessonValidator } = require("../../validations");
const { lessonController } = require("../../controllers");

router
  .route("/")
  .post(
    requireInstructor,
    validate(lessonValidator.createLesson),
    asyncMiddleware(lessonController.createLesson)
  );

module.exports = router;
