const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const lessonSchema = mongoose.Schema({
  grade: {
    type: mongoose.Types.ObjectId,
    ref: "Grade"
  },
  title: {
    type: String,
    unique: true
  },
  notes: {
    type: String
  },
  videoLink: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

lessonSchema.index({ grade: 1});
lessonSchema.index({ title: "text" });

lessonSchema.plugin(uniqueValidator, {
  message: "There is already a lesson with that {PATH}"
});
const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
