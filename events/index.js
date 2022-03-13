const emitter = require("./emitter");
const subscribers = require("./subscribers");

module.exports = {
  emitter,
  subscribers,
  events: {
    LESSON_PUBLISHED: "LESSON_PUBLISHED",
    QUIZ_PUBLISHED: "QUIZ_PUBLISHED"
  }
};
