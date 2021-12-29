const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const accessCodeSchema = mongoose.Schema({
  lesson: {
    type: mongoose.Types.ObjectId,
    ref: "Lesson"
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

accessCodeSchema.plugin(uniqueValidator, {
  message: "There is already a student with that {PATH}"
});
const AccessCode = mongoose.model("AccessCode", accessCodeSchema);

module.exports = AccessCode;
