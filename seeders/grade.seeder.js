const { Grade } = require("../models");

module.exports = async () =>
  await Grade.insertMany([
    {
      _id: "620e472e3dee2cd5b28a9bfa",
      name: "2nd secondary"
    },
    {
      _id: "620e473f62d74af088b0ab38",
      name: "3rd secondary"
    }
  ]);
