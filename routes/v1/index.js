const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const studentRouter = require("./student.route");
const adminRouter = require("./admin.route");
const gradeRouter = require("./grade.route");
const lessonRouter = require("./lesson.route");

router.use("/auth", authRouter);
router.use("/students", studentRouter);
router.use("/admins", adminRouter);
router.use("/grades", gradeRouter);
router.use("/lessons", lessonRouter);

module.exports = router;
