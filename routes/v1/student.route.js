const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const validate = require("../../middlewares/validator");
const { requireAuth } = require("../../middlewares/auth");
const formidable = require("express-formidable");

const { studentController } = require("../../controllers");
const { userValidator } = require("../../validations");

router.route("/").get(requireAuth, asyncMiddleware(studentController.getProfile));

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
    validate(userValidator.getUser),
    asyncMiddleware(studentController.getUser)
  );

module.exports = router;
