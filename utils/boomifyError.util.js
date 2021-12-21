const boom = require("@hapi/boom");

module.exports = errors => {
  const error = new boom.badRequest("Invalid data");
  error.output.payload.errors = [];
  errors.array().forEach(err => {
    err.message = err.msg;
    delete err.msg;
    error.output.payload.errors.push(err);
  });

  return error;
};
