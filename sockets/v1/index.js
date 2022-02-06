const { requireAuth } = require("../../middlewares/auth");
const { wrap } = require("../../utils/socketWrap.util");
const registerMessageSocket = require("./message.socket");

module.exports = io => socket => {
  io.use(wrap(requireAuth));

  registerMessageSocket(io, socket);

  socket.on("error", err => {
    let error = err.output?.payload;

    if (!error) {
      console.error(err);
      error = boom.badImplementation();
      error.output.payload.errors = err;
    }

    socket.emit("error", error);
  });
};
