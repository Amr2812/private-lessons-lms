const sgMail = require("@sendgrid/mail");
const { env } = require("./constants");

sgMail.setApiKey(env.SENDGRID_API_KEY);

module.exports = {
  sgMail,
  templates: {
    NEW_LESSON_ALERT: "d-5a956b6fec6b4002b631caa00a8a2ba4",
    NEW_QUIZ_ALERT: "d-280d0a8f076b4c3187f20e9e77e5f849",
    RESET_PASSWORD: "d-f806bfaedb5d40478c50004b00efe200"
  }
};
