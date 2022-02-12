const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseLeanId = require("mongoose-lean-id");
const formatLink = require("../utils/formatLink.util");

const studentSchema = mongoose.Schema(
  {
    facebookId: {
      type: String
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String
    },
    name: {
      type: String
    },
    phone: {
      type: String
    },
    parentPhone: {
      type: String
    },
    fcmTokens: {
      type: Array
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
    completed: {
      type: Boolean,
      default: false
    },
    passwordResetToken: {
      type: String
    },
    passwordResetExpire: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true } }
);

studentSchema.virtual("imageUrl").get(function () {
  return formatLink("students", this._id);
});

studentSchema.index({ email: 1 });
studentSchema.index({ name: "text" });
studentSchema.index({ facebookId: 1 });
studentSchema.index({ grade: 1, lessonsAttended: 1 });

studentSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (err) {
    next(err);
  }
});

studentSchema.pre("save", async function (next) {
  try {
    if (this.grade && this.phone && this.parentPhone) {
      this.completed = true;
    }

    next();
  } catch (err) {
    next(err);
  }
});

studentSchema.plugin(mongooseLeanVirtuals);

studentSchema.plugin(mongooseLeanId);

studentSchema.plugin(uniqueValidator, {
  message: "There is already a student with that {PATH}"
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
