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
  type: {
    type: String,
    enum: ["lesson", "quiz"]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

actionSchema.index({ createdAt: -1 });

const Action = mongoose.model("Action", actionSchema);

module.exports = Action;
