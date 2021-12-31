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
  imageUrl: {
    type: String
  },
  phone: {
    type: String
  },
  parentPhone: {
    type: String
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

studentSchema.index({ email: 1 });
studentSchema.index({ name: "text" });

studentSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
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
