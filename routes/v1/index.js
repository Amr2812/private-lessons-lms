const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const studentRouter = require("./student.route");
const adminRouter = require("./admin.route");
const gradeRouter = require("./grade.route");
const lessonRouter = require("./lesson.route");

router.use("/auth", authRouter);
router.use("/student", studentRouter);
router.use("/admin", adminRouter);
router.use("/grade", gradeRouter);
router.use("/lesson", lessonRouter);

module.exports = router;
