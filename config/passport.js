const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs");

const { Admin, Student } = require("../models");
const { authService } = require("../services");
const { env } = require("./constants");

module.exports = passport => {
  passport.use(
    "student-local",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const student = await Student.findOne({ email }).lean({
            virtuals: true
          });

          if (!student) {
            return done(null, false, {
              message: "This email is not registered"
            });
          }

          const passMatch = await bcrypt.compare(password, student.password);

          if (passMatch) {
            delete student.password;
            return done(null, student);
          } else {
            return done(null, false, { message: "Password Incorrect" });
          }
        } catch (err) {
          return done(null, false, { message: "This email is not registered" });
        }
      }
    )
  );

  passport.use(
    "student-facebook",
    new FacebookStrategy(
      {
        clientID: env.FACEBOOK_APP_ID,
        clientSecret: env.FACEBOOK_APP_SECRET,
        callbackURL: "/v1/auth/facebook/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const student = await Student.findOne({
            facebookId: profile.id
          }).lean({ virtuals: true });

          if (student) {
            delete student.password;
            return done(null, student);
          } else {
            const student = await authService.signup({
              facebookId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName
            });

            return done(null, student);
          }
        } catch (err) {
          return done(null, false, {
            message: "This email is already registered"
          });
        }
      }
    )
  );

  passport.use(
    "admin-local",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const admin = await Admin.findOne({ email }).lean({ virtuals: true });

          if (!admin) {
            return done(null, false, {
              message: "This email is not registered"
            });
          }

          const passMatch = await bcrypt.compare(password, admin.password);

          if (passMatch) {
            delete admin.password;
            return done(null, admin);
          } else {
            return done(null, false, { message: "Password Incorrect" });
          }
        } catch (err) {
          return done(null, false, { message: "This email is not registered" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role || "student" });
  });

  passport.deserializeUser(async ({ id, role }, done) => {
    try {
      let User;
      if (role === "student") {
        User = Student;
      } else {
        User = Admin;
      }

      const user = await User.findById(id).lean({ virtuals: true });
      delete user.password;
      delete user.resetPasswordToken;
      delete user.resetPasswordExpire;

      if (role === "student") {
        user.lessonsAttended = user.lessonsAttended.map(e => String(e));
        user.role = "student";
      }

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });
};
