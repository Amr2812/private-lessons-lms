const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseLeanId = require("mongoose-lean-id");
const bcrypt = require("bcryptjs");
const { constants } = require("../config/constants");
const { formatLink } = require("../utils");

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
      enum: constants.ADMINS_ROLES,
      default: constants.ROLES_ENUM.assistant
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

adminSchema.virtual("imageUrl").get(function () {
  return formatLink(constants.ADMINS_FOLDER, this._id);
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
