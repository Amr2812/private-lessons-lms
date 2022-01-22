require("dotenv").config();

module.exports.env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  FIREBASE_SERVICE_ACCOUNT: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT),
  GCS_BUCKET: process.env.GCS_BUCKET,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL
};

module.exports.constants = {
  MAX_FILE_SIZE: 1024 * 1024 * 5, // 5MB
  MAX_SIGNED_URL_EXPIRATION: 60 * 60 * 24 * 2, // 2 Days
  SESSION_COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 14, // 2 Weeks
  RATE_LIMITER_POINTS: 5,
  RATE_LIMITER_BLOCK_DURATION: 60 * 15, // 15 Minutes
  RATE_LIMITER_PERFIX: "RL"
};
