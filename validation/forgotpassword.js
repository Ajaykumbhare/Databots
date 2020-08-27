const validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateForgotPasswordInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email.toString() : "";

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
