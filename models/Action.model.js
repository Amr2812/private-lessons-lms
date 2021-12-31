const mongoose = require("mongoose");

const actionSchema = mongoose.Schema({
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Admin"
  },
  grade: {
    type: mongoose.Types.ObjectId,
    ref: "Grade"
  },
  count: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const Action = mongoose.model("Action", actionSchema);

module.exports = Action;
