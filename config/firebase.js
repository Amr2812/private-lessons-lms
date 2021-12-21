const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");

initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  storageBucket: "express-starter-38755.appspot.com"
});

const bucket = getStorage().bucket();

module.exports = { bucket };
