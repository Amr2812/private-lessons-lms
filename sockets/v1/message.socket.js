const boom = require("@hapi/boom");
const { messageService, notificationService } = require("../../services");
const { constants } = require("../../config/constants");

module.exports = (io, socket) => {
  const user = socket.request.user;

  const getChats = async (query, callback) => {
    try {
      const messages = await messageService.getChats(query);

      callback(messages);
    } catch (err) {
      const error = boom.badImplementation().output.payload;
      error.errors = err;
      callback(error);
    }
  };

  const enterRoom = async ({ studentId, lessonId }, callback) => {
    try {
      const roomName = messageService.getRoomName(studentId, lessonId);
      const inRoom = await io.in(roomName).fetchSockets();

      if (!inRoom.map(sock => sock.request.user.id !== user.id).length > 1) {
        return callback(
          boom.badRequest("An admin is already in the room").output.payload
        );
      }

      socket.join(roomName);
      const messages = await messageService.getMessages(
        user.role,
        studentId,
        lessonId
      );

      callback(messages);
    } catch (err) {
      const error = boom.badImplementation().output.payload;
      error.errors = err;
      callback(error);
    }
  };

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
        if (user.role === constants.ROLES_ENUM.student) {
          await notificationService.sendNotification(user.fcmTokens, {
            notification: {
              title: "Admin replied to your message",
              body: message.content.slice(0, 150) + "..."
            },
            data: message
          });
        } else {
          await notificationService.sendToTopic(constants.ADMINS_FCM_TOPIC, {
            notification: {
              title: user.name,
              body: message.content.slice(0, 150) + "..."
            },
            data: message
          });
        }
      }
    } catch (err) {
      const error = boom.badImplementation().output.payload;
      error.errors = err;
      callback(error);
    }
  };

  socket.use(([event, ...args], next) => {
    if (
      user.lessonsAttended?.includes(args[0].lessonId) ||
      user.role !== constants.ROLES_ENUM.student
    ) {
      next();
    } else {
      next(boom.unauthorized("You are not enrolled in this lesson"));
    }
  });

  socket.on("chats:get", getChats);
  socket.on("messages:enter", enterRoom);
  socket.on("messages:send", sendMessage);
};
