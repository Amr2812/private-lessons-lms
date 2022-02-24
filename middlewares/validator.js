const { validationResult, matchedData } = require("express-validator");
const { boomifyError } = require("../utils");

module.exports = validations => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (Object.values(req.body).length) req.body = matchedData(req);

  if (!errors.isEmpty()) next(boomifyError(errors));
  else next();
};
