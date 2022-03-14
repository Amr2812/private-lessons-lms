const { fcm } = require("../config/firebase");

/**
 * @async
 * @description Send notification to a topic
 * @param {String} topic
 * @param {Object} payload - Notification payload
 * @returns {Promise<Object} - Message ID
 */
module.exports.sendToTopic = async (topic, payload) => {
  payload.topic = topic;

  return await fcm.send(payload);
};

/**
 * @async
 * @description Subscribe user to a topic
 * @param {String} fcmToken
 * @param {String} topic
 * @returns {Promise<Object>} - Message ID
 */
module.exports.subscribeToTopic = async (fcmToken, topic) =>
  await fcm.subscribeToTopic(fcmToken, topic);

/**
 * @async
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
