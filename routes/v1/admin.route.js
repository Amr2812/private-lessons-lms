const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const { requireAdmin, requireInstructor } = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");
const formidable = require("express-formidable");

const { adminValidator } = require("../../validations");
const { adminController } = require("../../controllers");

router
  .route("/profile-image")
  .put(
    requireAdmin,
    formidable(),
    asyncMiddleware(adminController.updateProfileImage)
  );

router
  .route("/assistant")
  .post(
    requireInstructor,
    validate(adminValidator.createAssistant),
    asyncMiddleware(adminController.createAssistant)
  );

module.exports = router;
