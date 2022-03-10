const { quizService } = require("../services");
const { constants } = require("../config/constants");
const logger = require("../config/logger");
const boom = require("@hapi/boom");

/**
 * @async
 * @description create a new quiz
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.createQuiz = async (req, res, next) => {
  const quiz = await quizService.createQuiz(req.body);

  res.status(201).send(quiz);
};

/**
 * @async
 * @description Get Quizzes
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getQuizzes = async (req, res, next) => {
  const quizzes = await quizService.getQuizzes(req.query, req.user.role);

  res.send(quizzes);
};

/**
 * @async
 * @description Get Quiz
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.getQuiz = async (req, res, next) => {
  const quiz = await quizService.getQuiz(req.params.id, req.user);

  if (quiz instanceof Error) return next(quiz);

  res.send(quiz);
};

/**
 * @async
 * @description Publish Quiz
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.publishQuiz = async (req, res, next) => {
  const quiz = await quizService.publishQuiz(req.params.id);
  if (quiz instanceof Error) return next(quiz);

  quizService.eventEmitter.emit("QUIZ_PUBLISHED", quiz);

  res.sendStatus(204);
};

/**
 * @async
 * @description Un Publish Quiz
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.unpublishQuiz = async (req, res, next) => {
  const quiz = await quizService.unpublishQuiz(req.params.id);
  if (quiz instanceof Error) return next(quiz);

  res.sendStatus(204);
};

/**
 * @async
 * @description Take Quiz
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.takeQuiz = async (req, res, next) => {
  const quiz = await quizService.takeQuiz(
    req.user,
    req.params.id,
    req.body.code
  );
  if (quiz instanceof Error) return next(quiz);

  res.send(quiz);
};

/**
 * @async
 * @description Get Quiz Results
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Function} next - Express next middleware
 */
module.exports.checkAnswers = async (req, res, next) => {
  const quiz = await quizService.checkAnswers(
    req.user,
    req.params.id,
    req.body.answers
  );
  if (quiz instanceof Error) return next(quiz);

  res.send(quiz);
};
