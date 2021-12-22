const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");

const studentSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  name: {
    type: String,
    unique: true
  },
  image_url: {
    type: String
  },
  phone: {
    type: Number
  },
  parentPhone: {
    type: Number
  },
  grade: {
    type: mongoose.Types.ObjectId,
    ref: "Grade"
  },
  lessonsAttended: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Lesson"
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
});

studentSchema.index({ email: 1, name: "text" });

studentSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    bcrypt.hash(this.password, salt);
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

studentSchema.plugin(uniqueValidator, {
  message: "There is already a student with that {PATH}"
});
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
