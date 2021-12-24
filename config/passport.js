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
          const student = await Student.findOne({ email }).lean();
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
          const admin = await Admin.findOne({ email }).lean();
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
    done(null, { id: user._id, role: user.role || "student" });
  });

  passport.deserializeUser(async ({ id, role }, done) => {
    try {
      if (role === "student") {
        const student = await Student.findById(id).lean();
        done(null, student);
      } else {
        const admin = await Admin.findById(id).lean();
        done(null, admin);
      }
    } catch (err) {
      done(err, false);
    }
  });
};
