const { Admin } = require("../models");

module.exports = async () =>
  await Admin.insertMany([
    {
      _id: "620e46d53d374d3e98a297e6",
      email: "instructor@gmail.com",
      name: "Instructor",
      password: "password",
      role: "instructor"
    },
    {
      _id: "620e4701d4c68a6b87cba22a",
      email: "assistant@gmail.com",
      name: "Assistant",
      password: "password"
    }
  ]);
