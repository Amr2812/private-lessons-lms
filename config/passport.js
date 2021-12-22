const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const { studentRepo, adminRepo } = require("../repositories");

module.exports = passport => {
  passport.use(
    "student-local",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const student = await studentRepo.getStudentByEmail(email);
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
          const admin = await adminRepo.getAdminByEmail(email);
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

  passport.serializeUser((user, done) => {
    done(null, { id: user._id, type: user.role || "student" });
  });

  passport.deserializeUser(async ({ id, role }, done) => {
    try {
      if (role === "student") {
         const student = await studentRepo.getStudentById(id);
        done(null, student);
      } else {
        const admin = await adminRepo.getAdminById(id, false);
        done(null, admin);
      }
    } catch (err) {
      done(err, false);
    }
  });
};
