const winston = require("winston");
const Sentry = require("winston-transport-sentry-node").default;
const { env } = require("./constants");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

if (env.NODE_ENV === "production") {
  logger.add(
    new Sentry({
      sentry: { dsn: env.SENTRY_DSN },
      level: "error"
    })
  );
}

module.exports = logger;
