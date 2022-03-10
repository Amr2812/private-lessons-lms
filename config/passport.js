const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs");

const { Admin, Student } = require("../models");
const { authService, storageService } = require("../services");
const { env, constants } = require("./constants");

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
              message: "Incorrect Email or Password"
            });
          }

          const passMatch = await bcrypt.compare(password, student.password);

          if (passMatch) {
            delete student.password;
            return done(null, student);
          } else {
            return done(null, false, {
              message: "Incorrect Email or Password"
            });
          }
        } catch (err) {
          return done(null, false, { message: "Incorrect Email or Password" });
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
        callbackURL: "/v1/auth/facebook/callback",
        profileFields: ["id", "displayName", "email", "photos"]
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const student = await Student.findOne({
            facebookId: profile.id
          })
            .select("-password")
            .lean({ virtuals: true });

          if (student) {
            return done(null, student);
          } else {
            const student = await authService.signup({
              facebookId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName
            });

            storageService
              .getStreamAndUpload(
                constants.STUDENTS_FOLDER,
                student._id,
                profile.photos[0].value
              )
              .catch();

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
              message: "Incorrect Email or Password"
            });
          }

          const passMatch = await bcrypt.compare(password, admin.password);

          if (passMatch) {
            delete admin.password;
            return done(null, admin);
          } else {
            return done(null, false, {
              message: "Incorrect Email or Password"
            });
          }
        } catch (err) {
          return done(null, false, { message: "Incorrect Email or Password" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, {
      id: user.id,
      role: user.role || constants.ROLES_ENUM.student
    });
  });

  passport.deserializeUser(async ({ id, role }, done) => {
    try {
      let User;
      if (role === constants.ROLES_ENUM.student) {
        User = Student;
      } else {
        User = Admin;
      }

      const user = await User.findOne({ _id: id }).lean({ virtuals: true });

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      delete user.password;
      delete user.resetPasswordToken;
      delete user.resetPasswordExpire;

      if (role === constants.ROLES_ENUM.student) {
        user.lessonsAttended = user.lessonsAttended.map(e => String(e));
        user.quizzesTaken = user.quizzesTaken.map(e => String(e));
        user.role = constants.ROLES_ENUM.student;
      }

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });
};
