const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const boom = require("@hapi/boom");
const { env, constants } = require("./config/constants");
const logger = require("./config/logger");
const redisClient = require("./config/redis");
const v1Router = require("./routes/v1");
const rateLimiterMiddleware = require("./middlewares/rateLimiter");
const { wrap } = require("./utils");

require("./config/passport")(passport);

const app = express();
app.set("trust proxy", 1);

const io = new Server();
const v1Socket = require("./sockets/v1")(io);

const pubClient = redisClient;
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

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

// Logger
app.use(morgan("dev"));

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Security
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL
  })
);

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
    logger.error(Object.assign(err, { req }));

    const error = boom.badImplementation(err.message);
    error.output.payload.errors = err;

    return next(error);
  }

  if (err.data) err.output.payload.data = err.data;
  return res.status(err.output.statusCode).send(err.output.payload);
});

module.exports = { app, io };
