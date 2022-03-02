const winston = require("winston");
const { env } = require("./constants");

function setupTransports(logger) {
  if (env.NODE_ENV === "production") {
    /* 
      Add transports to the logger in production
      I added loggly transport but I found out that it's trial ends after 30 days
      I removed it as I want to be able torun the app in production forever for free
      If I ship the app to actual production I will add Google cloud logger
    */
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    );
  } else {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    );
  }

  return logger;
}

module.exports = setupTransports(winston.createLogger());
