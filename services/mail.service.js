const { mg } = require("../config/mailgun");
const { env } = require("../config/constants");

/**
 * @description Send email by template
 * @param {Array} to - Array of recipients
 * @param {String} subject - Email subject
 * @param {String} template - Email template
 * @param {Object} data - Data to be passed to template
 * @returns {Promise<Object>} - Message ID
 */
module.exports.sendEmail = async (to, subject, template, data) =>
  await mg.messages.create(env.MAILGUN_DOMAIN, {
    from: `${env.MAILGUN_USER} <${env.MAILGUN_FROM}>`,
    to,
    subject,
    template,
    "h:X-Mailgun-Variables": JSON.stringify(data)
  });
