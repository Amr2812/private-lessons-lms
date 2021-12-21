const { validationResult } = require("express-validator");
const boomifyError = require("../utils/boomifyError.util");

module.exports = validations => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) next(boomifyError(errors));
  else next();
};
