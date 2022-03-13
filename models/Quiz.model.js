const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseLeanId = require("mongoose-lean-id");

const questionSchema = new mongoose.Schema({
  question: {
    type: String
  },
  answers: [
    {
      type: String
    }
  ],
  correctAnswer: {
    type: String
  }
});

const quizSchema = mongoose.Schema({
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade"
  },
  title: {
    type: String,
    unique: true
  },
  questions: [questionSchema],
  notes: {
    type: String
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

quizSchema.index({ grade: 1, isPublished: 1, title: "text" });

quizSchema.plugin(mongooseLeanId);
quizSchema.plugin(uniqueValidator, {
  message: "There is already a quiz with that {PATH}"
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
