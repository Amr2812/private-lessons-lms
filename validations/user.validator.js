const { param } = require("express-validator");

module.exports.getUser = [param("id").notEmpty().withMessage("Id is required")];
