const { Student } = require("../models");

module.exports = async grades =>
  await Student.create([
    {
      name: "Student 1",
      email: "student1@gmail.com",
      password: "student1",
      grade: grades[0]._id,
      phone: "0122222222",
      parentPhone: "01222222222"
    },
    {
      name: "Student 2",
      email: "student2@gmail.com",
      password: "student2",
      grade: grades[1]._id,
      phone: "0122222222",
      parentPhone: "01222222222"
    }
  ]);
