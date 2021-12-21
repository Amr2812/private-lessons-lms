const express = require("express");
const router = express.Router();

const usersRouter = require("./users.route");
const authRouter = require("./auth.route");

router.use("/users", usersRouter);
router.use("/auth", authRouter);

module.exports = router;
