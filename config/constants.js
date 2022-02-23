require("dotenv").config();

module.exports.env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
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
  FRONTEND_URL: process.env.FRONTEND_URL,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET
};

module.exports.constants = {
  MAX_FILE_SIZE: 1024 * 1024 * 5, // 5MB
  MAX_SIGNED_URL_EXPIRATION: 60 * 60 * 24 * 2, // 2 Days
  SESSION_COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 14, // 2 Weeks
  RESET_PASSWORD_EXPIRATION: 1000 * 60 * 60 * 1, // 1 hour
  RESET_PASSWORD_TOKEN_LENGTH: 32,
  RATE_LIMITER_POINTS: 5,
  RATE_LIMITER_BLOCK_DURATION: 60 * 15, // 15 Minutes
  RATE_LIMITER_PERFIX: "RL",
  ROLES: ["student", "admin"],
  ADMINS_ROLES: ["assistant", "instructor"],
  ROLES_ENUM: {
    student: "student",
    admin: "admin",
    assistant: "assistant",
    instructor: "instructor"
  },
  ADMINS_FCM_TOPIC: "admins",
  ADMINS_FOLDER: "admins",
  STUDENTS_FOLDER: "students",
  LESSONS_FOLDER: "lessons",
  MAX_ACCESS_CODES_PER_REQUEST: 1000
};
