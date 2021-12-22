const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");

const adminSchema = mongoose.Schema({
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
  role: {
    type: String,
    enum: ["assistant", "instructor"],
    default: "assistant"
  },
  image_url: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

adminSchema.index({ email: 1, name: "text" });

adminSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    bcrypt.hash(this.password, salt);
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

adminSchema.plugin(uniqueValidator, {
  message: "There is already a user with that {PATH}"
});
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
