const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const { requireAuth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");

const { authValidator } = require("../../validations");
const { authController } = require("../../controllers");

router
  .route("/signup")
  .post(
    validate(authValidator.studentSignup),
    asyncMiddleware(authController.studentSignup)
  );

router
  .route("/login/student")
  .post(
    validate(authValidator.studentLogin),
    asyncMiddleware(authController.studentLogin)
  );

router
  .route("/login/admin")
  .post(
    validate(authValidator.adminLogin),
    asyncMiddleware(authController.adminLogin)
  );

router
  .route("/logout")
  .delete(requireAuth, asyncMiddleware(authController.logout));

module.exports = router;
