const { Student } = require("../models");

module.exports = async () =>
  await Student.create([
    {
      _id: "620e47ec1df2e6906cd4ca0f",
      name: "Amr Elmohamady",
      email: "ana.osama.elmohamady@gmail.com",
      password: "password",
      grade: "620e472e3dee2cd5b28a9bfa",
      phone: "01270279427",
      parentPhone: "01222222222",
      lessonsAttended: ["620e6d77edf87951594deeb5"],
      quizzesTaken: ["62281099b189f199c01b7dd8"]
    },
    {
      _id: "620e47fa8e4b1428f90a9d0d",
      name: "Richard Hendricks",
      email: "richy@gmail.com",
      password: "password",
      grade: "620e472e3dee2cd5b28a9bfa",
      phone: "0122222222",
      parentPhone: "01222222222"
    },
    {
      _id: "620e48e9e0fd9a5528196ed2",
      name: "Arya Stark",
      email: "arya@gmail.com",
      password: "password",
      grade: "620e472e3dee2cd5b28a9bfa",
      phone: "0122222222",
      parentPhone: "01222222222"
    },
    {
      _id: "620e47f8d4c68a6b87cba22b",
      name: "Richard Dundermifflin",
      email: "student2@gmail.com",
      password: "password",
      grade: "620e473f62d74af088b0ab38",
      phone: "0122222222",
      parentPhone: "01222222222"
    },
    {
      _id: "620e48646139e4e1bb44ae80",
      name: "John Doe",
      email: "student3@gmail.com",
      password: "password",
      grade: "620e473f62d74af088b0ab38",
      phone: "0122222222",
      parentPhone: "01222222222"
    },
    {
      _id: "620e4926364e5b5f07b2370b",
      name: "Lory Preem",
      email: "lory@gmail.com",
      password: "password",
      grade: "620e473f62d74af088b0ab38",
      phone: "0122222222",
      parentPhone: "01222222222",
      lessonsAttended: ["620e1d77edf87951594daeb5"],
      quizzesTaken: ["622810b26332522caabbb6d5"]
    }
  ]);
