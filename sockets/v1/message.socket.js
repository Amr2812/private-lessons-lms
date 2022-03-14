const boom = require("@hapi/boom");
const { messageService, adminService } = require("../../services");

/**
 * @description register messages socket events and handlers
 * @param {Object} io - Socket.io instance
 * @param {Object} socket - Socket.io connected socket
 */
module.exports = (io, socket) => {
  const user = socket.request.user;

  /**
   * @async
   * @description Get chats
   * @param {Object} query
   * @param {Object} query.lessonId
   * @param {Object} [query.skip=0]
   * @param {Object} [query.limit=10]
   * @param {Function} callback
   */
  const getChats = async (query, callback) => {
    try {
      const messages = await messageService.getChats(query);

      callback(messages);
    } catch (err) {
      const error = boom.badImplementation(err.message).output.payload;
      error.errors = err;
      callback(error);
    }
  };

  /**
   * @async
   * @description Enter chat room and get messages
   * @param {Object} body
   * @param {String} body.studentId
   * @param {String} body.lessonId
   * @param {Function} callback
   */
  const enterRoom = async ({ studentId, lessonId }, callback) => {
    try {
      const roomName = messageService.getRoomName(studentId, lessonId);
      socket.join(roomName);

      const messages = await messageService.getMessages(
        user.role,
        studentId,
        lessonId
      );

      callback(messages);
    } catch (err) {
      const error = boom.badImplementation(err.message).output.payload;
      error.errors = err;
      callback(error);
    }
  };

  /**
   * @async
   * @description Send message
   * @param {Object} body - Message body
   * @param {String} body.studentId
   * @param {String} body.lessonId
   * @param {String} body.content
   * @param {String} body.from - From student or admin
   * @param {Function} callback
   */
  const sendMessage = async (
    { studentId, lessonId, content, from },
    callback
  ) => {
    try {
      const message = await messageService.createMessage(
        studentId,
        lessonId,
        content,
        from
      );
      callback(message);

      const roomName = messageService.getRoomName(studentId, lessonId);

      const inRoom = await io
        .in(roomName)
        .fetchSockets()
        .map(sock => sock.request.user.id !== user.id);

      if (inRoom.length > 0) {
        socket.broadcast.to(roomName).emit("messages:message", message);
      } else {
        await messageService.notifyAdminOrStudent(user, message);
      }
    } catch (err) {
      const error = boom.badImplementation(err.message).output.payload;
      error.errors = err;
      callback(error);
    }
  };

  socket.use(([event, ...args], next) => {
    if (
      user.lessonsAttended?.includes(args[0].lessonId) ||
      adminService.isAdmin(user)
    ) {
      next();
    } else {
      next(boom.unauthorized("You are not enrolled in this lesson"));
    }
  });

  socket.on("chats:get", getChats);
  socket.on("chats:enter", enterRoom);
  socket.on("messages:send", sendMessage);
};
