const mongodbInit = require("../config/mongodb");

const adminSeeder = require("./admin.seeder");
const gradeSeeder = require("./grade.seeder");
const studentSeeder = require("./student.seeder");
const accessCodeSeeder = require("./accessCode.seeder");
const lessonSeeder = require("./lesson.seeder");
const mongoose = require("mongoose");

module.exports.run = async dropDB => {
  console.log("Starting...\n");

  try {
    await mongodbInit();

    if (dropDB) {
      await mongoose.connection.db.dropDatabase();
      console.log("\x1b[32m%s\x1b[0m", "Database Dropped\n");
    }

    await adminSeeder();
    console.log("Admins seeded");

    await gradeSeeder();
    console.log("Grades seeded");

    await studentSeeder();
    console.log("Students seeded");

    await accessCodeSeeder();
    console.log("AccessCodes seeded");

    await lessonSeeder();
    console.log("Lessons seeded");

    return await Promise.resolve();
  } catch (err) {
    return await Promise.reject(err);
  }
};
