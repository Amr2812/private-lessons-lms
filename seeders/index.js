const mongodbInit = require("../config/mongodb");
const logger = require("../config/logger");
const adminSeeder = require("./admin.seeder");
const gradeSeeder = require("./grade.seeder");
const studentSeeder = require("./student.seeder");
const accessCodeSeeder = require("./accessCode.seeder");
const lessonSeeder = require("./lesson.seeder");
const quizSeeder = require("./quiz.seeder");
const mongoose = require("mongoose");

module.exports.run = async dropDB => {
  logger.info("Starting...\n");

  try {
    await mongodbInit();

    if (dropDB) {
      await mongoose.connection.db.dropDatabase();
      logger.info("Database Dropped");
    }

    await adminSeeder();
    logger.info("Admins seeded");

    await gradeSeeder();
    logger.info("Grades seeded");

    await accessCodeSeeder();
    logger.info("AccessCodes seeded");

    await lessonSeeder();
    logger.info("Lessons seeded");

    await quizSeeder();
    logger.info("Quizzes seeded");

    await studentSeeder();
    logger.info("Students seeded");

    return await Promise.resolve();
  } catch (err) {
    return await Promise.reject(err);
  }
};
