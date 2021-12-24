const Redis = require("ioredis");
require("dotenv").config();

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

client.on("error", err => {
  console.error(err);
});

module.exports = client;
