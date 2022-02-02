const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const { Admin, Student } = require("../models");

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
