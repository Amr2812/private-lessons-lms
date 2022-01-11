const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const boom = require("@hapi/boom");
const helmet = require("helmet");

const passport = require("passport");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const redisClient = require("./config/redis");

const rateLimiterMiddleware = require("./middlewares/rateLimiter");

const { env, constants } = require("./config/constants");

require("./config/passport")(passport);

const v1Router = require("./routes/v1");

const app = express();

app.set("trust proxy", 1);

// express session
app.use(
  session({
    secret: env.SECRET,
    saveUninitialized: false,
    rolling: true,
    resave: true,
    store: new RedisStore({ client: redisClient }),
    cookie: {
      secure: env.NODE_ENV === "production" ? true : false,
      httpOnly: true,
      maxAge: constants.SESSION_COOKIE_MAX_AGE
    }
  })
);

// express middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Helmet Security
app.use(helmet());

// passport
app.use(passport.initialize());
app.use(passport.session());

// rateLimiter
app.use(rateLimiterMiddleware);

// routes
app.use("/v1", v1Router);

// 404 Handler
app.use((req, res, next) => {
  next(boom.notFound());
});

// Error Handler
app.use((err, req, res, next) => {
  return res.status(err.output.statusCode).json(err.output.payload);
});

module.exports = app;
