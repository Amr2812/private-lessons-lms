const { Quiz, AccessCode, Student } = require("../models");
const { sendToTopic } = require("./notification.service");
const { sendEmail } = require("./mail.service");
const { templates } = require("../config/sendGrid");
const { constants, env } = require("../config/constants");
const logger = require("../config/logger");
const boom = require("@hapi/boom");
const { EventEmitter } = require("events");

/**
 * @async
 * @description create a new quiz
 * @param {Oject} quiz
 * @returns {Promise<Object>} - quiz
 */
module.exports.createQuiz = async quiz => await Quiz.create(quiz);

/**
 * @async
 * @description get quizzes
 * @param {Object} queryParams - (grade, isPublished, q, skip, limit)
 * @param {String} userRole - User role
 * @returns {Promise<Object>} - (quizzes, total)
 */
module.exports.getQuizzes = async (
  { grade, isPublished, q, skip, limit },
  userRole
) => {
  let query = {};
  let sort = { createdAt: 1 };

  if (!constants.ADMINS_ROLES.includes(userRole)) {
    query = {
      grade,
      isPublished: true
    };
  } else {
    query = {
      grade,
      isPublished
    };
  }

  if (q) {
    query.$text = { $search: q };
    sort = { score: { $meta: "textScore" } };
  }

  const total = await Quiz.countDocuments(query);
  if (total < 1) {
    return { quizzes: [], total };
  }

  const quizzes = await Quiz.find(query)
    .sort(sort)
    .skip(skip || 0)
    .limit(limit || 10)
    .select("title")
    .lean();

  return { quizzes, total };
};

/**
 * @async
 * @description Get quiz by id
 * @param {String} id - Quiz id
 * @param {Object} user - User
 * @returns {Promise<Object>} - Quiz
 */
module.exports.getQuiz = async (id, user) => {
  const isStudent = user.role === constants.ROLES_ENUM.student;
  if (isStudent && !user.quizzesTaken.includes(id)) {
    return boom.unauthorized("You have to take this quiz to view it");
  }

  const quiz = await Quiz.findOne({ _id: id })
    .populate({ path: "grade", select: "name" })
    .lean();

  if (!quiz) return boom.notFound("Quiz not found");
  if (!quiz.isPublished && !constants.ADMINS_ROLES.includes(user.role)) {
    return boom.notFound("Quiz is not published");
  }

  if (isStudent) {
    quiz.questions = quiz.questions.map(question => {
      delete question.correctAnswer;
      return question;
    });
  }

  return quiz;
};

/**
 * @async
 * @description Publish quiz
 * @param {String} id - Quiz id
 * @returns {Promise<Object>} - Quiz
 */
module.exports.publishQuiz = async id => {
  const res = await Quiz.updateOne({ _id: id }, { isPublished: true });

  if (res.matchedCount < 1) {
    return boom.notFound("Quiz not found");
  }

  return res;
};

/**
 * @async
 * @description Un Publish quiz
 * @param {String} id - Quiz id
 * @returns {Promise<Object>} - Quiz
 */
module.exports.unpublishQuiz = async id => {
  const res = await Quiz.updateOne({ _id: id }, { isPublished: false });

  if (res.matchedCount < 1) {
    return boom.notFound("Quiz not found");
  }

  return res;
};

/**
 * @async
 * @description Take quiz
 * @param {Object} user
 * @param {String} quizId - Quiz id
 * @param {String} code - Access code
 * @returns {Promise<Object>} - Quiz
 */
module.exports.takeQuiz = async (user, quizId, code) => {
  if (user.role !== constants.ROLES_ENUM.student) {
    return boom.unauthorized("You have to be a student to take a quiz");
  }

  const quiz = await Quiz.findOne({
    isPublished: true,
    _id: quizId
  }).lean();

  if (!quiz) return boom.notFound("Quiz not found");

  const accessCode = await AccessCode.findOne({
    code,
    grade: quiz.grade
  });

  if (!accessCode) return boom.notFound("Access code not found");
  if (accessCode.consumed) return boom.badRequest("Access code already used");
  if (accessCode.type !== "quiz")
    return boom.badRequest("Access code is not for lessons");

  if (user.quizzesTaken.includes(quizId)) {
    return boom.badRequest("You already took this quiz you can access it");
  }

  await Student.updateOne(
    { _id: user.id },
    {
      $push: {
        quizzesTaken: quizId
      }
    }
  );

  accessCode.consumed = true;
  await accessCode.save({ validateBeforeSave: false });

  quiz.questions = quiz.questions.map(question => {
    delete question.correctAnswer;
    return question;
  });

  return quiz;
};

/**
 * @async
 * @description Submit quiz to check answers and score
 * @param {Object} user - user object
 * @param {String} quizId - Quiz id
 * @param {Array[Object]} answers - (questionId, answer)
 * @returns {Promise<String>} - Score
 */
module.exports.checkAnswers = async (user, quizId, answers) => {
  const isStudent = user.role === constants.ROLES_ENUM.student;
  if (isStudent && !user.quizzesTaken.includes(quizId)) {
    return boom.unauthorized(
      "You have to take this quiz to check your answers"
    );
  }

  const quiz = await Quiz.findOne({ _id: quizId }).lean();

  if (!quiz) return boom.notFound("Quiz not found");
  if (!quiz.isPublished && !constants.ADMINS_ROLES.includes(user.role)) {
    return boom.notFound("Quiz is not published");
  }

  const result = answers.reduce(
    ({ score, wrongAnswers }, answer) => {
      const question = quiz.questions.find(
        question => question.id === answer.id
      );
      if (!question) return { score, wrongAnswers };

      if (question.correctAnswer === answer.answer) {
        score++;
        return { score, wrongAnswers };
      }

      wrongAnswers.push(question);
      return { score, wrongAnswers };
    },
    { score: 0, wrongAnswers: [] }
  );

  return result;
};

const eventEmitter = new EventEmitter();

eventEmitter.on("QUIZ_PUBLISHED", async quiz => {
  try {
    await sendToTopic(String(quiz.grade), {
      notification: {
        title: "New Quiz is Published",
        body: `${quiz.title} is now available for students to take.`
      },
      data: {
        type: "quiz",
        id: quiz.id
      }
    });

    const students = await Student.find(
      {
        grade: quiz.grade
      },
      "email"
    ).lean();

    const emails = students.map(student => student.email);
    await sendEmail(emails, templates.NEW_QUIZ_ALERT, {
      title: quiz.title,
      url: `${env.FRONTEND_URL}/quizzes/${quiz.id}`
    });
  } catch (err) {
    logger.error(err);
  }
});

module.exports.eventEmitter = eventEmitter;
