const boom = require("@hapi/boom");

module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    if (!err.isBoom) {
      if (err.name === "ValidationError") {
        const error = new boom.badRequest("Invalid data");
        error.output.payload.errors = [];
        Object.values(err.errors).forEach(err =>
          error.output.payload.errors.push(err.properties)
        );

        return next(error);
      }
      console.log(err);
      return next(boom.boomify(err));
    }
    next(err);
  });
};
