const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const { userRepo } = require("../repositories");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userRepo.getUserByEmail(email);
          if (!user) {
            return done(null, false, {
              message: "This email is not registered"
            });
          }

          const passMatch = await bcrypt.compare(password, user.password);

          if (passMatch) {
            delete user.password;
            return done(null, user);
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
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userRepo.getUserById(id, false);
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });
};
