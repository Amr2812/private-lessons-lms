const { Lesson } = require("../models");

module.exports = async () =>
  await Lesson.insertMany([
    {
      _id: "620e47ec1df2e6906cd4ca0f",
      grade: "620e472e3dee2cd5b28a9bfa",
      title: "Week 1",
      notes: "This is the first lesson",
      isPublished: false
    },
    {
      _id: "620e6d77edf87951594deeb5",
      grade: "620e472e3dee2cd5b28a9bfa",
      title: "Week 2",
      notes: "This is the second lesson",
      isPublished: true
    },
    {
      _id: "620e6d7c818466cc23fa7b22",
      grade: "620e472e3dee2cd5b28a9bfa",
      title: "Week 3",
      notes: "This is the third lesson",
      isPublished: true
    },
    {
      _id: "620e17ec1df2e6906cd4ca0f",
      grade: "620e473f62d74af088b0ab38",
      title: "Lesson 1",
      notes: "This is the first lesson",
      isPublished: false
    },
    {
      _id: "620e1d77edf87951594deeb5",
      grade: "620e473f62d74af088b0ab38",
      title: "Lesson 2",
      notes: "This is the second lesson",
      isPublished: true
    },
    {
      _id: "620e1d77edf87951594daeb5",
      grade: "620e473f62d74af088b0ab38",
      title: "Lesson 3",
      notes: "This is the third lesson",
      isPublished: true
    }
  ]);
