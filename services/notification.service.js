const { fcm } = require("../config/firebase");

/**
 * @async
 * @function sendToTopic
 * @description Send notification to a topic
 * @param {string} topic
 * @param {object} payload - Notification payload
 * @returns {Promise<Object} - Message ID
 */
module.exports.sendToTopic = async (topic, payload) => {
  payload.topic = topic;

  return await fcm.send(payload);
};

/**
 * @async
 * @function subscribeToTopic
 * @description Subscribe user to a topic
 * @param {string} fcmToken
 * @param {string} topic
 * @returns {Promise<Object>} - Message ID
 */
module.exports.subscribeToTopic = async (fcmToken, topic) =>
  await fcm.subscribeToTopic(fcmToken, topic);

/**
 * @async
 * @function sendNotification
 * @description Send notification
 * @param {String | Array[String]} fcmTokens
 * @param {Object} payload - Notification payload
 * @returns {Promise<Object>} - Message ID
 */
module.exports.sendNotification = async (fcmTokens, payload) => {
  if (typeof fcmTokens === "string") {
    payload.token = fcmTokens;
    return await fcm.send(payload);
  } else {
    payload.tokens = fcmTokens;
    return await fcm.sendAll(payload);
  }
};
