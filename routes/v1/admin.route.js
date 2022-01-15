const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const { requireAdmin, requireInstructor } = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");

const { adminValidator } = require("../../validations");
const { adminController } = require("../../controllers");

router
  .route("/profile-image")
  .put(
    requireAdmin,
    adminController.updateProfileImage.single("file"),
    (req, res) => res.sendStatus(204)
  );

router
  .route("/assistant")
  .post(
    requireInstructor,
    validate(adminValidator.createAssistant),
    asyncMiddleware(adminController.createAssistant)
  );

router
  .route("/actions")
  .get(requireInstructor, asyncMiddleware(adminController.getActions));

module.exports = router;
