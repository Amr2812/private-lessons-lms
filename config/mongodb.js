const mongoose = require("mongoose");
const { env } = require("./constants");

module.exports = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
