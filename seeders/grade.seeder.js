const { Grade } = require("../models");

module.exports = async () =>
  await Grade.insertMany([
    {
      name: "2nd secondary"
    },
    {
      name: "3rd secondary"
    }
  ]);
