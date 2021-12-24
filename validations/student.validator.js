const { param } = require("express-validator");

module.exports.getStudent = [param("id").isMongoId().withMessage("Invalid id")];
