const boom = require("@hapi/boom");
const logger = require("../config/logger");

module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    if (!err.isBoom) {
      if (err.name === "ValidationError") {
        const error = boom.badRequest("Invalid data");
        error.output.payload.errors = [];
        Object.values(err.errors).forEach(err =>
          error.output.payload.errors.push(err.properties)
        );

        return next(error);
      }

      logger.error(err);
      return next(boom.badImplementation(err.message, err));
    }
    next(err);
  });
};
