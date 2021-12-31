const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../../middlewares/asyncErrors");
const { requireAdmin } = require("../../middlewares/auth");
const validate = require("../../middlewares/validator");

const { accessCodeValidator } = require("../../validations");
const { accessCodeController } = require("../../controllers");

router
  .route("/grade/:gradeId")
  .get(
    requireAdmin,
    validate(accessCodeValidator.generateAccessCodes),
    asyncMiddleware(accessCodeController.generateAccessCodes)
  );

module.exports = router;
