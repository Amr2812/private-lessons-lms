const mongoose = require("mongoose");
const { env } = require("./constants");

module.exports = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("\x1b[32m%s\x1b[0m", "MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
