const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { env } = require("./constants");

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: env.MAILGUN_USER,
  key: env.MAILGUN_API_KEY
});

module.exports = { mg };
