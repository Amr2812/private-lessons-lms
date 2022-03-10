const { env } = require("../config/constants");
const { sgMail } = require("../config/sendGrid");

/**
 * @async
 * @description Send email by template
 * @param {Array} to - Array of recipients
 * @param {String} templateId - Email template ID
 * @param {Object} data - Data to be passed to template
 * @returns {Promise<Object>} - Message ID
 */
module.exports.sendEmail = async (to, templateId, data) =>
  await sgMail.send({
    from: `${env.EMAIL_USERNAME} <${env.EMAIL_FROM}>`,
    to,
    templateId,
    dynamic_template_data: data,
    isMultiple: true
  });
