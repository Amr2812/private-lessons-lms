const mongoose = require("mongoose");

const accessCodeSchema = mongoose.Schema({
  grade: {
    type: mongoose.Types.ObjectId,
    ref: "Grade"
  },
  type: {
    type: String,
    enum: ["lesson", "quiz"]
  },
  code: {
    type: String,
    unique: true
  },
  consumed: {
    type: Boolean,
    default: false
  }
});

accessCodeSchema.index({ code: 1 });

const AccessCode = mongoose.model("AccessCode", accessCodeSchema);

module.exports = AccessCode;
