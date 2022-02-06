const mongoose = require("mongoose");
const mongooseLeanId = require("mongoose-lean-id");

const messageSchema = mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson"
  },
  from: {
    type: String,
    enum: ["student", "admin"]
  },
  content: {
    type: String
  },
  seen: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

messageSchema.plugin(mongooseLeanId);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
