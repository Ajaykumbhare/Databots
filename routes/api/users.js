const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/key");
const passport = require("passport");
// const generator = require("generate-password");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const async = require("async");

//Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateForgotPasswordInput = require("../../validation/forgotpassword");
const validateResetPassword = require("../../validation/reset-password");

//Load User Model
const User = require("../../models/User");

/*
 *  @route Post Request from api/users/register
 *  @desc Register user route
 *  @access Public
 */

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email Already Exists" });
    } else {
      const tokenGenerate = new Promise((resolve, reject) => {
        try {
          crypto.randomBytes(20, function (err, buf) {
            let token = buf.toString("hex");
            return resolve(token);
          });
        } catch {
          reject("Error in Token Generate");
        }
      });

      tokenGenerate
        .then(token => {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            roleId: req.body.roleId,
            profileStatusToken: token,
            profileStatusExpires: Date.now() + 3600000 // 1 hour
          });

          if (req.body.roleId === 1) {
            newUser.profileStatusExpires = null;
            newUser.profileStatusToken = null;
            newUser.status = 1;
          }

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save().catch(e => console.log(e));
            });
          });
          return newUser.profileStatusToken;
        })
        .then(newUser => {
          const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.email,
              pass: process.env.password
            }
          });
          const mailOptions = {
            to: req.body.email,
            from: process.env.email,
            subject: "Verify Your Email Address",
            text:
              "Verify Your Email Address.\n\n" +
              "Hi\n\n" +
              "You have updated your email address as " +
              req.body.email +
              "Click the link below to verify the email address and get it updated in Databots records.\n" +
              "Once verified, you can login on Databots\n\n" +
              "http://" +
              req.headers.host.replace(/5000/g, "3000") +
              "/profileToken/" +
              newUser +
              "\n\n" +
              "Thanks.\n" +
              "Databots.\n"
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            return res.json({
              success:
                "An e-mail has been sent to " +
                req.body.email +
                " with further instructions.",
              user: req.body.email
            });
          });
        });
    }
  });
});

/*
    @route Post resendActivation from api/users/resendActivation
    @desc Resend Activation link  route
    @access Private
*/

router.post(
  "/resendActivation",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // return res.json(req.body.id);
    User.findById(req.body.id).then(user => {
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      } else {
        const tokenGenerate = new Promise((resolve, reject) => {
          try {
            crypto.randomBytes(20, function (err, buf) {
              let token = buf.toString("hex");
              return resolve(token);
            });
          } catch {
            reject("Error in Token Generate");
          }
        });

        tokenGenerate
          .then(token => {
            user.profileStatusToken = token;
            user.profileStatusExpires = Date.now() + 3600000; // 1 hour

            user.save().catch(e => console.log(e));
            return user.profileStatusToken;
          })
          .then(newUser => {
            const smtpTransport = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.email,
                pass: process.env.password
              }
            });
            const mailOptions = {
              to: user.email,
              from: process.env.email,
              subject: "Verify Your Email Address",
              text:
                "Verify Your Email Address.\n\n" +
                "Hi\n\n" +
                "You have updated your email address as " +
                user.email +
                "Click the link below to verify the email address and get it updated in Databots records.\n" +
                "Once verified, you can login on Databots\n\n" +
                "http://" +
                req.headers.host.replace(/5000/g, "3000") +
                "/profileToken/" +
                newUser +
                "\n\n" +
                "Thanks.\n" +
                "Databots.\n"
            };
            smtpTransport.sendMail(mailOptions, function (err) {
              return res.json({
                success:
                  "An e-mail has been sent to " +
                  user.email +
                  " with further instructions.",
                user: user.email
              });
            });
          });
      }
    });
  }
);

/*
    @route Post Request from api/users/update
    @desc update user route
    @access Public
*/

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newUser = {
      name: req.body.name,
      password: req.body.password,
      contactNo: req.body.contactNo,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      country: req.body.country === "" ? "Other" : req.body.country,
      updated_on: Date.now()
    };

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        User.findOneAndUpdate(
          { email: newUser.email },
          { $set: newUser },
          { new: true }
        )
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  }
);

router.post("/forgotpassword", function (req, res, next) {
  const { errors, isValid } = validateForgotPasswordInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            return res.status(400).json({
              email: "No account with that email address exists."
            });
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.email,
            pass: process.env.password
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.email,
          subject: "dataBOTS Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host.replace(/5000/g, "3000") +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          return res.status(200).json({
            success:
              "An e-mail has been sent to " +
              user.email +
              " with further instructions.",
            user: user.email
          });
        });
      }
    ],
    function (err) {
      if (err)
        return res.status(400).json({
          error: err
        });
    }
  );
});

router.get("/reset/:token", function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function (err, user) {
      if (!user) {
        return res.status(400).json({
          error: "Password reset token is invalid or has expired."
        });
      }

      return res.status(200).json({
        status: "Token is Valid"
      });
    }
  );
});

router.post("/reset/:token", function (req, res) {
  const { errors, isValid } = validateResetPassword(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function (err, user) {
      if (!user) {
        return res.status(400).json({
          error: "Password reset token is invalid or has expired."
        });
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;
          user
            .save()
            .then(user => {
              res.status(200).json({ status: "password successfully changed" });
            })
            .catch(err => console.log(err));
        });
      });
    }
  );
});

router.get("/profile/:token", function (req, res) {
  User.findOne(
    {
      profileStatusToken: req.params.token,
      profileStatusExpires: { $gt: Date.now() }
    },
    function (err, user) {
      if (!user) {
        return res.status(400).json({
          error: "Token is invalid or has expired."
        });
      }

      user.profileStatusToken = null;
      user.profileStatusExpires = null;
      user.status = 1;
      user
        .save()
        .then(user => {
          res.status(200).json({ status: "profile successfully activated" });
        })
        .catch(err => console.log(err));
    }
  ).catch(e => console.log(e));
});

/*
  @route Post Request from api/users/login
  @desc login user route
  @access Public
*/

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not Found" });
    }
    //check status
    if (user.status === 0 || user.status === 1) {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //Sign Token
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            status:
              user.status === 0
                ? "not_active"
                : user.status === 1
                  ? "active"
                  : "banned"
          };

          jwt.sign(
            payload,
            key.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res.status(400).json({
            password: "Password Incorrect"
          });
        }
      });
    } else {
      return res.status(404).json({ email: "your account is disabled" });
    }
  });
});

/*
    @route GET Request from api/users/current
    @desc return current User
    @access Private
*/

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user.id).then(profileData => {
      res.status(200).json({
        email: profileData.email,
        name: profileData.name,
        contactNo: profileData.contactNo === null ? "" : profileData.contactNo,
        dateOfBirth:
          profileData.dateOfBirth === null ? "" : profileData.dateOfBirth,
        country: profileData.country === null ? "" : profileData.country,
        password: profileData.password === null ? "" : profileData.password
      });
    });
  }
);

/*
    @route Get Request from api/users/:email
    @desc Get User Information by email
    @access Private
*/

router.get(
  `/:email`,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.roleId === 1) {
      const errors = [];
      User.findOne({ email: req.params.email })
        .then(profile => {
          if (!profile) {
            errors.noprofile = "There is no profile for this user";
            res.status(404).json(errors);
          }
          res.json(profile);
        })
        .catch(err =>
          res.status(404).json({ profile: "There is no profile for this user" })
        );
    } else {
      res.status(401).json({ status: "Unauthorized User" });
    }
  }
);

/*
    @route post Request from api/users/:email
    @desc disable users
    @access Private
*/

/*
//     @route post Request from api/users/:email
//     @desc disable users
//     @access Public
*/

router.post(
  `/:email`,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.roleId === 1) {
      User.findOne({ email: req.params.email }).then(status => {
        if (status.status === 1 || status.status === 0) {
          User.findOneAndUpdate(
            { email: req.params.email },
            { $set: { status: 2, deleted_on: Date.now() } },
            { new: true }
          ).then(() => {
            User.find()
              .then(profile => {
                if (!profile) {
                  errors.noprofile = "There is no profile for this user";
                  res.status(404).json(errors);
                }
                res.json(profile);
              })
              .catch(err =>
                res
                  .status(404)
                  .json({ profile: "There is no profile for this user" })
              );
          });
        } else {
          User.findOneAndUpdate(
            { email: req.params.email },
            { $set: { status: 1, deleted_on: null } },
            { new: true }
          ).then(() => {
            User.find()
              .then(profile => {
                if (!profile) {
                  errors.noprofile = "There is no profile for this user";
                  res.status(404).json(errors);
                }
                res.json(profile);
              })
              .catch(err =>
                res
                  .status(404)
                  .json({ profile: "There is no profile for this user" })
              );
          });
        }
      });
    } else {
      res.status(401).json({ status: "Unauthorized User" });
    }
  }
);

// router.post(
//   `/:email`,
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     if (req.user.roleId === 0) {
//       User.findOne({ email: req.params.email }).then(status => {
//         if (status.status !== 2) {
//           User.findOneAndUpdate(
//             { email: req.params.email },
//             { $set: { status: 2, deleted_on: Date.now() } },
//             { new: true }
//           ).then(() => {
//             User.find()
//               .then(profile => {
//                 if (!profile) {
//                   errors.noprofile = "There is no profile for this user";
//                   res.status(404).json(errors);
//                 }
//                 res.json(profile);
//               })
//               .catch(err =>
//                 res
//                   .status(404)
//                   .json({ profile: "There is no profile for this user" })
//               );
//           });
//         } else {
//           res.json({ profile: "Already Banned" });
//         }
//       });
//     } else {
//       res.status(401).json({ status: "Unauthorized User" });
//     }
//   }
// );

router.get(
  `/`,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.roleId === 1) {
      const errors = [];
      User.find(
        {},
        {
          name: 1,
          email: 1,
          roleId: 1,
          status: 1
        }
      )
        .then(profile => {
          if (!profile) {
            errors.noprofile = "There is no profile for this user";
            res.status(404).json(errors);
          }
          res.json(profile);
        })
        .catch(err =>
          res.status(404).json({ profile: "There is no profile for this user" })
        );
    } else {
      res.status(401).json({ status: "Unauthorized User" });
    }
  }
);

module.exports = router;
