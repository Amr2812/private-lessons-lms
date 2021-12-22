const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const actionSchema = mongoose.Schema({
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Admin"
  },
  grade: {
    type: mongoose.Types.ObjectId,
    ref: "Grade"
  },
  lesson: {
    type: mongoose.Types.ObjectId,
    ref: "Lesson"
  },
  count: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

actionSchema.plugin(uniqueValidator, {
  message: "There is already a student with that {PATH}"
});
const Action = mongoose.model("Action", actionSchema);

module.exports = Action;
