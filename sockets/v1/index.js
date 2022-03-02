const { requireAuth } = require("../../middlewares/auth");
const { wrap } = require("../../utils");
const registerMessageSocket = require("./message.socket");
const logger = require("../../config/logger");

module.exports = io => socket => {
  io.use(wrap(requireAuth));

  registerMessageSocket(io, socket);

  socket.on("error", err => {
    let error = err.output?.payload;

    if (!error) {
      logger.error(Object.assign(err, { socket }));
      error = boom.badImplementation(err.message);
      error.output.payload.errors = err;
    }

    socket.emit("error", error.output.payload);
  });
};
