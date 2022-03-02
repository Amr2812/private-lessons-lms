const Redis = require("ioredis");
const { env } = require("./constants");
const logger = require("./logger");

const client = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD
});

client.on("connect", () => {
  logger.info("Redis connected");
});

client.on("error", err => {
  logger.error(err);
});

module.exports = client;
