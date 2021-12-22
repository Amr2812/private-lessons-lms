const express = require("express");
const router = express.Router();

const studentRouter = require("./student.route");
const authRouter = require("./auth.route");

router.use("/student", studentRouter);
router.use("/auth", authRouter);

module.exports = router;
