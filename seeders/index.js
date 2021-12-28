const mongodbInit = require("../config/mongodb");

const adminSeeder = require("./admin.seeder");
const gradeSeeder = require("./grade.seeder");
const studentSeeder = require("./student.seeder");

(async () => {
  try {
    await mongodbInit();

    await adminSeeder();
    console.log("Admin seeded");

    const grades = await gradeSeeder();
    console.log("Grade seeded");

    await studentSeeder(grades);
    console.log("Student seeded");

    console.log("Seeding completed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
