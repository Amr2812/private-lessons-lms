const { nanoid } = require("nanoid/async");
const { constants, env } = require("../config/constants");
const { templates } = require("../config/sendGrid");
const { Student, Admin } = require("../models");
const { sendEmail } = require("./mail.service");
const { subscribeToTopic } = require("./notification.service");
const { isStudent } = require("./student.service");

/**
 * @async
 * @description Signup a new user
 * @param {Object} student
 * @returns {Promise<Object>}
 */
module.exports.signup = async student => {
  student.fcmTokens = student.fcmToken ? [student.fcmToken] : [];
  const createdStudent = await Student.create(student);
  createdStudent.password = undefined;

  if (createdStudent.fcmToken) {
    await subscribeToTopic(
      createdStudent.fcmToken,
      String(createdStudent.grade)
    );
  }

  return createdStudent;
};

/**
 * @async
 * @description Forgot password check email and send reset password link
 * @param {String} body
 * @param {String} body.email - Email to check
 * @param {String} body.role - Role to check
 * @returns {Promise<Object>}
 */
module.exports.forgotPassword = async ({ email, role }) => {
  let User;
  if (isStudent({ role })) {
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
 * @param {String} body
 * @param {String} body.role
 * @param {String} body.password - New password
 * @returns {Promise<Object>}
 */
module.exports.resetPassword = async (token, { role, password }) => {
  let User;
  if (isStudent({ role })) {
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
