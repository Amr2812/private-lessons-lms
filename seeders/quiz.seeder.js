const { Quiz } = require("../models");

module.exports = async () =>
  await Quiz.insertMany([
    {
      _id: "622810918d999ce30660b9b6",
      grade: "620e472e3dee2cd5b28a9bfa",
      title: "Week 1",
      notes: "This is the first quiz",
      isPublished: false,
      questions: [
        {
          _id: "622810918d999ce30660b9b7",
          question: "Who is the creator of this platform?",
          answers: ["Thomas Shelby", "Amr Elmohamady"],
          correctAnswer: "Amr Elmohamady"
        },
        {
          _id: "622810918d999ce30660b9b8",
          question: "What is the capital of the United States?",
          answers: ["New York", "Washington", "Los Angeles"],
          correctAnswer: "Washington"
        },
        {
          _id: "622810918d999ce30660b9b9",
          question: "What is the capital of the United Kingdom?",
          answers: ["London", "Paris", "Berlin"],
          correctAnswer: "London"
        },
        {
          _id: "622810918d999ce30660b9ba",
          question: "Who is the founder of the company Apple?",
          answers: [
            "Steve Jobs",
            "Bill Gates",
            "Steve Wozniak",
            "Tim Cook",
            "Andrew Carnegie"
          ],
          correctAnswer: "Steve Jobs"
        },
        {
          _id: "622810918d999ce30660b9bb",
          question: "Is this a quiz?",
          answers: ["Yes", "No"],
          correctAnswer: "Yes"
        }
      ]
    },
    {
      _id: "62281099b189f199c01b7dd8",
      grade: "620e472e3dee2cd5b28a9bfa",
      title: "Week 2",
      notes: "This is the second quiz",
      isPublished: true,
      questions: [
        {
          _id: "62281099b189f199c01b7dd9",
          question: "Who is the creator of this platform?",
          answers: ["Thomas Shelby", "Amr Elmohamady"],
          correctAnswer: "Amr Elmohamady"
        },
        {
          _id: "62281099b189f199c01b7dda",
          question: "What is the capital of the United States?",
          answers: ["New York", "Washington", "Los Angeles"],
          correctAnswer: "Washington"
        },
        {
          _id: "62281099b189f199c01b7ddb",
          question: "What is the capital of the United Kingdom?",
          answers: ["London", "Paris", "Berlin"],
          correctAnswer: "London"
        },
        {
          _id: "62281099b189f199c01b7ddc",
          question: "Who is the founder of the company Apple?",
          answers: [
            "Steve Jobs",
            "Bill Gates",
            "Steve Wozniak",
            "Margot Robbie",
            "Andrew Carnegie"
          ],
          correctAnswer: "Steve Jobs"
        },
        {
          _id: "62281099b189f199c01b7ddd",
          question: "Is this a quiz?",
          answers: ["Yes", "No"],
          correctAnswer: "Yes"
        }
      ]
    },
    {
      _id: "622810a0b7104ec6466dc4d6",
      grade: "620e472e3dee2cd5b28a9bfa",
      title: "Week 3",
      notes: "This is the third quiz",
      isPublished: true,
      questions: [
        {
          _id: "6227aa5535e464afc6388b09",
          question: "Who is the creator of this platform?",
          answers: ["Thomas Shelby", "Amr Elmohamady"],
          correctAnswer: "Amr Elmohamady"
        },
        {
          _id: "6227aa5535e464afc6388b0a",
          question: "What is the capital of the United States?",
          answers: ["New York", "Washington", "Los Angeles"],
          correctAnswer: "Washington"
        },
        {
          _id: "6227aa5535e464afc6388b0b",
          question: "What is the capital of the United Kingdom?",
          answers: ["London", "Paris", "Berlin"],
          correctAnswer: "London"
        },
        {
          _id: "6227aa5535e464afc6388b0c",
          question: "Who is the founder of the company Apple?",
          answers: [
            "Steve Jobs",
            "Bill Gates",
            "Steve Wozniak",
            "Tim Cook",
            "Andrew Carnegie"
          ],
          correctAnswer: "Steve Jobs"
        },
        {
          _id: "6227aa5535e464afc6388b0d",
          question: "Is this a quiz?",
          answers: ["Yes", "No"],
          correctAnswer: "Yes"
        }
      ]
    },
    {
      _id: "622810a7ae7465c0a02c0556",
      grade: "620e473f62d74af088b0ab38",
      title: "Quiz 1",
      notes: "This is the first quiz",
      isPublished: false,
      questions: [
        {
          _id: "622810a7ae7465c0a02c0557",
          question: "Who is the creator of this platform?",
          answers: ["Thomas Shelby", "Amr Elmohamady"],
          correctAnswer: "Amr Elmohamady"
        },
        {
          _id: "622810a7ae7465c0a02c0558",
          question: "What is the capital of the United States?",
          answers: ["New York", "Washington", "Los Angeles"],
          correctAnswer: "Washington"
        },
        {
          _id: "622810a7ae7465c0a02c0559",
          question: "What is the capital of the United Kingdom?",
          answers: ["London", "Paris", "Berlin"],
          correctAnswer: "London"
        },
        {
          _id: "622810a7ae7465c0a02c055a",
          question: "Who is the founder of the company Apple?",
          answers: [
            "Steve Jobs",
            "Bill Gates",
            "Steve Wozniak",
            "Tim Cook",
            "Andrew Carnegie"
          ],
          correctAnswer: "Steve Jobs"
        },
        {
          _id: "622810a7ae7465c0a02c055b",
          question: "Is this a quiz?",
          answers: ["Yes", "No"],
          correctAnswer: "Yes"
        }
      ]
    },
    {
      _id: "622810ac641709b5a6229f64",
      grade: "620e473f62d74af088b0ab38",
      title: "Quiz 2",
      notes: "This is the second quiz",
      isPublished: true,
      questions: [
        {
          _id: "622810ac641709b5a6229f65",
          question: "Who is the creator of this platform?",
          answers: ["Thomas Shelby", "Amr Elmohamady"],
          correctAnswer: "Amr Elmohamady"
        },
        {
          _id: "622810aa641709b5a6229f66",
          question: "What is the capital of the United States?",
          answers: ["New York", "Washington", "Los Angeles"],
          correctAnswer: "Washington"
        },
        {
          _id: "622810aa641709b5a6229f67",
          question: "What is the capital of the United Kingdom?",
          answers: ["London", "Paris", "Berlin"],
          correctAnswer: "London"
        },
        {
          _id: "622810aa641709b5a6229f68",
          question: "Who is the founder of the company Apple?",
          answers: [
            "Steve Jobs",
            "Bill Gates",
            "Steve Wozniak",
            "Tim Cook",
            "Andrew Carnegie"
          ],
          correctAnswer: "Steve Jobs"
        },
        {
          _id: "622810aa641709b5a6229f69",
          question: "Is this a quiz?",
          answers: ["Yes", "No"],
          correctAnswer: "Yes"
        }
      ]
    },
    {
      _id: "622810b26332522caabbb6d5",
      grade: "620e473f62d74af088b0ab38",
      title: "Quiz 3",
      notes: "This is the third quiz",
      isPublished: true,
      questions: [
        {
          _id: "622810b26332522caabbb6d6",
          question: "Who is the creator of this platform?",
          answers: ["Thomas Shelby", "Amr Elmohamady"],
          correctAnswer: "Amr Elmohamady"
        },
        {
          _id: "622810b26332522caabbb6d7",
          question: "What is the capital of the United States?",
          answers: ["New York", "Washington", "Los Angeles"],
          correctAnswer: "Washington"
        },
        {
          _id: "622810b26332522caabbb6d8",
          question: "What is the capital of the United Kingdom?",
          answers: ["London", "Paris", "Berlin"],
          correctAnswer: "London"
        },
        {
          _id: "622810b26332522caabbb6d9",
          question: "Who is the founder of the company Apple?",
          answers: [
            "Steve Jobs",
            "Bill Gates",
            "Steve Wozniak",
            "Tim Cook",
            "Andrew Carnegie"
          ],
          correctAnswer: "Steve Jobs"
        },
        {
          _id: "622810b26332522caabbb6da",
          question: "Is this a quiz?",
          answers: ["Yes", "No"],
          correctAnswer: "Yes"
        }
      ]
    }
  ]);
