const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

const trasporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: "12f7a0f64e5323f48795aad00d43483b-913a5827-1c7c078c",
      domain: "sandbox40579021b16244218611f0b79efe2e68.mailgun.org"
    }
  })
);

exports.getSignup = (req, res, next) => {
  let message = req.flash("existingEmail");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isLoggedIn: false,
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash(
          "existingEmail",
          "This email has already been used to create registration."
        );
        return req.session.save(err => {
          res.redirect("/signup");
        });
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect("/login");
          return trasporter
            .sendMail({
              to: email,
              from: "shop@nodecomplete.com",
              subject: "SignUp completed",
              html:
                "<h1>You have successfully completed sign up action to this online shop!</h1>"
            })
            .catch(err => console.log(err));
        });
    })
    .catch(err => console.log("postSignUp error"));
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    isLoggedIn: false,
    pageTitle: "Login",
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid email or password...");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password...");
          req.session.save(err => {
            res.redirect("/login");
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => console.log("postLogin error"));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
