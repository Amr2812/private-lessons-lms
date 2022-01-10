const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseLeanId = require("mongoose-lean-id");
const formatLink = require("../utils/formatLink.util");

const adminSchema = mongoose.Schema(
  {
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
    role: {
      type: String,
      enum: ["assistant", "instructor"],
      default: "assistant"
    },
    date: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true } }
);

adminSchema.virtual("imageUrl").get(function () {
  return formatLink("admins", this._id);
});

adminSchema.index({ email: 1 });
adminSchema.index({ name: "text" });

adminSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

adminSchema.plugin(mongooseLeanVirtuals);

adminSchema.plugin(mongooseLeanId);

adminSchema.plugin(uniqueValidator, {
  message: "There is already a user with that {PATH}"
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
