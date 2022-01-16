const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");
const { getMessaging } = require("firebase-admin/messaging");
const { env } = require("./constants");

initializeApp({
  credential: cert(env.FIREBASE_SERVICE_ACCOUNT),
  storageBucket: env.GCS_BUCKET
});

const bucket = getStorage().bucket();

const fcm = getMessaging();

module.exports = { bucket, fcm };
