const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateWorkRequestInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text.toString() : "";

  if (validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
