module.exports = middleware => (socket, next) =>
  middleware(socket.request, {}, next);
