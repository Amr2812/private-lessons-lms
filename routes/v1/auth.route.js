const passport = require("passport");
const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const validate = require("../../middlewares/validator");
const { requireAuth } = require("../../middlewares/auth");
const { authValidator } = require("../../validations");
const { authController } = require("../../controllers");

router
  .route("/signup")
  .post(
    validate(authValidator.studentSignup),
    asyncMiddleware(authController.studentSignup)
  );

router
  .route("/login")
  .post(validate(authValidator.login), asyncMiddleware(authController.login));

router
  .route("/logout")
  .delete(requireAuth, asyncMiddleware(authController.logout));

router
  .route("/forgot-password")
  .post(
    validate(authValidator.forgotPassword),
    asyncMiddleware(authController.forgotPassword)
  );

router
  .route("/reset-password/:resetPasswordToken")
  .post(
    validate(authValidator.resetPassword),
    asyncMiddleware(authController.resetPassword)
  );

router.get(
  "/facebook",
  passport.authenticate("student-facebook", {
    scope: ["email"]
  })
);

router.get("/facebook/callback", authController.facebookCallback);

module.exports = router;
