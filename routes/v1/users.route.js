const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const validate = require("../../middlewares/validator");
const { requireAuth } = require("../../middlewares/auth");
const formidable = require("express-formidable");

const { userController } = require("../../controllers");
const { userValidator } = require("../../validations");

router.route("/").get(asyncMiddleware(userController.getUsers));

router
  .route("/profile-image")
  .put(
    requireAuth,
    formidable(),
    asyncMiddleware(userController.updateProfileImage)
  );

router
  .route("/:id")
  .get(
    validate(userValidator.getUser),
    asyncMiddleware(userController.getUser)
  );

module.exports = router;
