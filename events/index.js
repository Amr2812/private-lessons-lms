const EventEmitter = require("./emitter");

module.exports = {
  EventEmitter,
  events: {
    LESSON_PUBLISHED: "LESSON_PUBLISHED",
    QUIZ_PUBLISHED: "QUIZ_PUBLISHED"
  }
};
