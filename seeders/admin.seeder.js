const { Admin } = require("../models");

module.exports = async () =>
  await Admin.insertMany([
    {
      email: "instructor@gmail.com",
      name: "instructor",
      password: "instructor",
      role: "instructor"
    },
    {
      email: "assistant@gmail.com",
      name: "assistant",
      password: "assistant"
    }
  ]);
