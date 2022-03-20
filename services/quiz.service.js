const boom = require("@hapi/boom");
const { Types } = require("mongoose");
const { Quiz, AccessCode, Student } = require("../models");
const { isStudent } = require("./student.service");
const { isAdmin } = require("./admin.service");
const { events, EventEmitter } = require("../events");

/**
 * @async
 * @description create a new quiz
 * @param {Oject} quiz
 * @returns {Promise<Object>} - Quiz
 */
module.exports.createQuiz = async quiz => await Quiz.create(quiz);

/**
 * @async
 * @description get quizzes
 * @param {Object} user
 * @param {Object} query
 * @param {String} query.grade - grade id
 * @param {Boolean} [query.isPublished=false]
 * @param {String} [query.q] - search query
 * @param {Number} [query.skip]
 * @param {Number} [query.limit]
 * @returns {Promise<Object>} - { quizzes, total }
 */
module.exports.getQuizzes = async (
  user,
  { grade, isPublished, q, skip, limit }
) => {
  let query = { grade, isPublished: true };
  let sort = { createdAt: 1 };

  if (isAdmin(user)) {
    if (isPublished !== undefined) {
      query.isPublished = isPublished;
    } else {
      query.isPublished = true;
    }
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
 * @param {Object} user - User
 * @param {String} id - Quiz id
 * @returns {Promise<Object>} - Quiz
 */
module.exports.getQuiz = async (user, id) => {
  if (this.takenQuiz(user, id)) {
    return boom.unauthorized("You have to take this quiz to view it");
  }

  const quiz = await Quiz.findOne({ _id: id })
    .populate({ path: "grade", select: "name" })
    .lean();

  if (!quiz) return boom.notFound("Quiz not found");
  if (!quiz.isPublished && !isAdmin(user)) {
    return boom.notFound("Quiz is not published");
  }

  if (isStudent(user)) {
    quiz.questions = quiz.questions.map(question => {
      delete question.correctAnswer;
      return question;
    });
  }

  return quiz;
};

/**
 * @async
 * @description Update a question from a quiz
 * @param {String} quizId - Quiz id
 * @param {String} questionId - Question id
 * @param {Object} question - Question
 * @returns {Promise<Object>} - Quiz
 */
module.exports.updateQuestion = async (quizId, questionId, question) => {
  // Set _id to be the old id because mongoose will set it to a new id
  question._id = Types.ObjectId(questionId);
  const updatedQuestion = await Quiz.findOneAndUpdate(
    { _id: quizId, "questions._id": questionId },
    { $set: { "questions.$": question } },
    { new: true }
  )
    .select({
      questions: { $elemMatch: { _id: questionId } }
    })
    .lean();
  if (!updatedQuestion) return boom.notFound("Question not found");

  return updatedQuestion;
};

/**
 * @async
 * @description Publish quiz
 * @param {String} id - Quiz id
 * @returns {Promise<Object>} - Quiz
 */
module.exports.publishQuiz = async id => {
  const quiz = await Quiz.findByIdAndUpdate(
    id,
    { isPublished: true },
    { new: true }
  ).lean();

  if (!quiz) {
    return boom.notFound("Quiz not found");
  }

  EventEmitter.emit(events.QUIZ_PUBLISHED, quiz);

  return quiz;
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
  if (!isStudent(user)) {
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

  if (this.takenQuiz(user, quizId)) {
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
 * @returns {Promise<Object>} - { score, wrongAnswers }
 */
module.exports.checkAnswers = async (user, quizId, answers) => {
  if (!this.takenQuiz(user, quizId)) {
    return boom.unauthorized(
      "You have to take this quiz to check your answers"
    );
  }

  const quiz = await Quiz.findOne({ _id: quizId }).lean();

  if (!quiz) return boom.notFound("Quiz not found");
  if (!quiz.isPublished && !isAdmin(user)) {
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

/**
 * @description check if student has taken quiz
 * @param {Object} user
 * @param {String} quizId - Quiz id
 * @returns {Boolean} - true if student has taken quiz
 */
module.exports.takenQuiz = (user, quizId) =>
  isStudent(user) && user.quizzesTaken.includes(quizId);
