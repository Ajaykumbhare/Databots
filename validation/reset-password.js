const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateResetPassword(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password.toString() : "";
  data.password2 = !isEmpty(data.password2) ? data.password2.toString() : "";

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password =
      "Password must be atleast 6 Character and Max 30 Characters long";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Password must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
