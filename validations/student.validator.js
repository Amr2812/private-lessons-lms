const { param } = require("express-validator");

module.exports.getStudent = [param("id").notEmpty().withMessage("Id is required")];
