const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const { requireInstructor } = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");

const { adminValidator } = require("../../validations");
const { adminController } = require("../../controllers");

router
  .route("/assistant")
  .post(
    requireInstructor,
    validate(adminValidator.createAssistant),
    asyncMiddleware(adminController.createAssistant)
  );

module.exports = router;