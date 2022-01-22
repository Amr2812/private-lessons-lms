const sgMail = require("@sendgrid/mail");
const { env } = require("./constants");

sgMail.setApiKey(env.SENDGRID_API_KEY);

module.exports = {
  sgMail,
  templates: {
    NEW_LESSON_ALERT: "d-5a956b6fec6b4002b631caa00a8a2ba4"
  }
};
