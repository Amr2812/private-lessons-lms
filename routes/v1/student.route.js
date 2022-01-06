const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const validate = require("../../middlewares/validator");
const { requireAuth, requireAdmin } = require("../../middlewares/auth");
const formidable = require("express-formidable");

const { studentController } = require("../../controllers");
const { studentValidator } = require("../../validations");

router
  .route("/")
  .get(
    requireAdmin,
    validate(studentValidator.getStudents),
    asyncMiddleware(studentController.getStudents)
  );

router
  .route("/profile")
  .get(requireAuth, asyncMiddleware(studentController.getProfile));

router
  .route("/profile-image")
  .put(
    requireAuth,
    formidable(),
    asyncMiddleware(studentController.updateProfileImage)
  );

router
  .route("/:id")
  .get(
    requireAdmin,
    validate(studentValidator.getStudent),
    asyncMiddleware(studentController.getStudent)
  );

module.exports = router;
