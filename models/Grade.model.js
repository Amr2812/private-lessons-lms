const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseLeanId = require("mongoose-lean-id");

const gradeSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
});

gradeSchema.plugin(mongooseLeanId);
gradeSchema.plugin(uniqueValidator, {
  message: "There is already a grade with that {PATH}"
});

const Grade = mongoose.model("Grade", gradeSchema);

module.exports = Grade;
