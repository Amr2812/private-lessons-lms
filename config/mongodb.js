const mongoose = require("mongoose");
const { env } = require("./constants");
const logger = require("./logger");

module.exports = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info("MongoDB Connected");
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};
