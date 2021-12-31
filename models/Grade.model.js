const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const gradeSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  accessCodes: [
    {
      type: String,
      unique: true
    }
  ]
});

gradeSchema.plugin(uniqueValidator, {
  message: "There is already a grade with that {PATH}"
});
const Grade = mongoose.model("Grade", gradeSchema);

module.exports = Grade;
