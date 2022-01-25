const { Student, Admin } = require("../models");
const { constants, env } = require("../config/constants");
const { sendEmail } = require("../services/mail.service");
const { templates } = require("../config/sendGrid");

const { nanoid } = require("nanoid/async");

/**
 * @async
 * @description Signup a new user
 * @param {Object} student - Student object
 * @returns {Promise<Object>}
 */
module.exports.signup = async student => {
  const createdStudent = await Student.create(student);
  createdStudent.password = undefined;

  return createdStudent;
};

/**
 * @async
 * @description Forgot password check email and send reset password link
 * @param {String} body - (email, role)
 * @returns {Promise<Object>}
 */
module.exports.forgotPassword = async ({ email, role }) => {
  let User;
  if (role === "student") {
    User = Student;
  } else {
    User = Admin;
  }

  const user = await User.findOne({ email }).lean();

  if (!user) return;

  if (user.resetPasswordExpire > Date.now()) return;

  const resetPasswordToken = await nanoid(
    constants.RESET_PASSWORD_TOKEN_LENGTH
  );

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpires = Date.now() + constants.RESET_PASSWORD_EXPIRATION;

  await User.updateOne({ _id: user.id }, user);

  return await sendEmail([email], templates.RESET_PASSWORD, {
    url: `${env.FRONTEND_URL}/auth/${role}/reset-password/${resetPasswordToken}`
  });
};

/**
 * @async
 * @description Reset password
 * @param {String} token - Reset password token
 * @param {String} body - (role, password)
 * @returns {Promise<Object>}
 */
module.exports.resetPassword = async (token, { role, password }) => {
  let User;
  if (role === "student") {
    User = Student;
  } else {
    User = Admin;
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }
  }).lean();

  if (!user) return boom.badRequest("Invalid token");

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;

  return await User.updateOne({ _id: user.id }, user);
};
