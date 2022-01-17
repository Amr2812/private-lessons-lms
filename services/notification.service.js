const { fcm } = require("../config/firebase");

/**
 * @async
 * @function sendToTopic
 * @description Send notification to a topic
 * @param {string} topic
 * @param {object} payload - Notification payload
 * @returns {Promise<String} - Message ID
 */
module.exports.sendToTopic = async (topic, payload) => {
  payload.topic = topic;

  return await fcm.send(payload);
};
