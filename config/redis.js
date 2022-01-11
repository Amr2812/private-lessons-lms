const Redis = require("ioredis");
const { env } = require("./constants");

const client = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD
});

client.on("connect", () => {
  console.log("Redis connected");
});

client.on("error", err => {
  console.error(err);
});

module.exports = client;
