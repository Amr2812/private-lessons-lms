module.exports.wrap = middleware => (socket, next) =>
  middleware(socket.request, {}, next);
