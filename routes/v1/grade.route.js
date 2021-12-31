const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const { requireInstructor } = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");

const { gradeValidator } = require("../../validations");
const { gradeController } = require("../../controllers");

router
  .route("/")
  .get(asyncMiddleware(gradeController.getGrades))
  .post(
    requireInstructor,
    validate(gradeValidator.createGrade),
    asyncMiddleware(gradeController.createGrade)
  );

router
  .route("/:id")
  .patch(
    requireInstructor,
    validate(gradeValidator.updateGrade),
    asyncMiddleware(gradeController.updateGrade)
  );

router
  .route("/:id/access-codes")
  .get(
    requireInstructor,
    validate(gradeValidator.generateAccessCodes),
    asyncMiddleware(gradeController.generateAccessCodes)
  );

module.exports = router;
