const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const boom = require("@hapi/boom");
const helmet = require("helmet");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");

const passport = require("passport");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const redisClient = require("./config/redis");

const rateLimiterMiddleware = require("./middlewares/rateLimiter");

const { env, constants } = require("./config/constants");
const { wrap } = require("./utils");

require("./config/passport")(passport);

const v1Router = require("./routes/v1");

const app = express();
app.set("trust proxy", 1);

const io = new Server();

const pubClient = redisClient;
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

const v1Socket = require("./sockets/v1")(io);

// express session
const sessionMiddleware = session({
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
});

app.use(sessionMiddleware);
io.use(wrap(sessionMiddleware));

// Dev Logger
app.use(logger("dev"));

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Helmet Security
app.use(helmet());

// passport
app.use(passport.initialize());
app.use(passport.session());

io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

// rateLimiter
app.use(rateLimiterMiddleware);

// Socket.io
io.on("connection", v1Socket);

// routes
app.use("/v1", v1Router);

// 404 Handler
app.use((req, res, next) => {
  next(boom.notFound());
});

// Error Handler
app.use((err, req, res, next) => {
  if (!err.output?.payload || !err.output?.statusCode) {
    console.error(err);
    const error = boom.badImplementation();
    error.output.payload.errors = err;

    return next(error);
  }
  return res.status(err.output.statusCode).json(err.output.payload);
});

module.exports = { app, io };
