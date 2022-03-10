const { AccessCode } = require("../models");

module.exports = async () =>
  await AccessCode.insertMany([
    // Lessons
    {
      _id: "620e47ec1df2e6906cd4ca0f",
      grade: "620e472e3dee2cd5b28a9bfa",
      type: "lesson",
      code: "12345678"
    },
    {
      _id: "620e47ec1df2e6906cd4cf0f",
      grade: "620e472e3dee2cd5b28a9bfa",
      type: "lesson",
      code: "12341678"
    },
    {
      _id: "620e47ec1df2e6926cd4cc0f",
      grade: "620e472e3dee2cd5b28a9bfa",
      type: "lesson",
      code: "12345178",
      consumed: true
    },
    {
      _id: "620e6bc715ba3a44f482b74d",
      grade: "620e473f62d74af088b0ab38",
      type: "lesson",
      code: "87654321"
    },
    {
      _id: "620e6bd951c5fa2884101be0",
      grade: "620e473f62d74af088b0ab38",
      type: "lesson",
      code: "sds654321"
    },
    {
      _id: "620e6be323fa48ea7eb07c21",
      grade: "620e473f62d74af088b0ab38",
      type: "lesson",
      code: "r654a32?1",
      consumed: true
    },
    // Quizzes
    {
      _id: "620e47ec1df2e6906cd4ca8f",
      grade: "620e472e3dee2cd5b28a9bfa",
      type: "quiz",
      code: "12345670"
    },
    {
      _id: "620e47ec1da2e6906cd4cf0f",
      grade: "620e472e3dee2cd5b28a9bfa",
      type: "quiz",
      code: "12n41678"
    },
    {
      _id: "620e47ec1df2e5926cd4cc0f",
      grade: "620e472e3dee2cd5b28a9bfa",
      type: "quiz",
      code: "12w4q178",
      consumed: true
    },
    {
      _id: "620e6bc715ba3a24f482b74d",
      grade: "620e473f62d74af088b0ab38",
      type: "quiz",
      code: "876543q1"
    },
    {
      _id: "620e6bd951c5fa3884101be0",
      grade: "620e473f62d74af088b0ab38",
      type: "quiz",
      code: "szs6q4351"
    },
    {
      _id: "620e6bd951c5fa3884101ba0",
      grade: "620e473f62d74af088b0ab38",
      type: "quiz",
      code: "rd5423221",
      consumed: true
    }
  ]);
