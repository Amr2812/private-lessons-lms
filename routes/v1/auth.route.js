const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const { requireAuth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");

const { authValidator } = require("../../validations");
const { authController } = require("../../controllers");

router
  .route("/signup")
  .post(validate(authValidator.signup), asyncMiddleware(authController.signup));

router
  .route("/login")
  .post(validate(authValidator.login), asyncMiddleware(authController.login));

router
  .route("/logout")
  .delete(requireAuth, asyncMiddleware(authController.logout));

module.exports = router;
