const { fcm } = require("../config/firebase");

/**
 * @async
 * @function sendToTopic
 * @description Send notification to a topic
 * @param {string} topic - Topic name
 * @param {object} payload - Notification payload
 * @returns {Promise<String} - Message ID
 */
module.exports.sendToTopic = async (topic, payload) => {
  const message = {
    topic,
    notification: payload
  };

  return await fcm.send(message);
};
