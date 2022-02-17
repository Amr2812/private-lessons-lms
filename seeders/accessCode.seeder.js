const { AccessCode } = require("../models");

module.exports = async () =>
  await AccessCode.create([
    {
      _id: "620e47ec1df2e6906cd4ca0f",
      grade: "620e472e3dee2cd5b28a9bfa",
      code: "12345678"
    },
    {
      _id: "620e47ec1df2e6906cd4cf0f",
      grade: "620e472e3dee2cd5b28a9bfa",
      code: "12341678"
    },
    {
      _id: "620e47ec1df2e6926cd4cc0f",
      grade: "620e472e3dee2cd5b28a9bfa",
      code: "12345178",
      consumed: true
    },
    {
      _id: "620e6bc715ba3a44f482b74d",
      grade: "620e473f62d74af088b0ab38",
      code: "87654321"
    },
    {
      _id: "620e6bd951c5fa2884101be0",
      grade: "620e473f62d74af088b0ab38",
      code: "sds654321"
    },
    {
      _id: "620e6be323fa48ea7eb07c21",
      grade: "620e473f62d74af088b0ab38",
      code: "r654a32?1",
      consumed: true
    }
  ]);
