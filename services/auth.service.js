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
 * @param {String} body - (email, accountRole)
 * @returns {Promise<Object>}
 */
module.exports.forgotPassword = async ({ email, accountRole }) => {
  let User;
  if (accountRole === "student") {
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
    url: `${env.FRONTEND_URL}/auth/${accountRole}/reset-password/${resetPasswordToken}`
  });
};

/**
 * @async
 * @description Reset password
 * @param {String} token - Reset password token
 * @param {String} body - (accountRole, password)
 * @returns {Promise<Object>}
 */
module.exports.resetPassword = async (token, { accountRole, password }) => {
  let User;
  if (accountRole === "student") {
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
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  return await User.updateOne({ _id: user.id }, user);
};
