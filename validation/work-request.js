const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateWorkRequestInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title.toString() : "";
  data.description = !isEmpty(data.description)
    ? data.description.toString()
    : "";

  if (!validator.isLength(data.title, { min: 6, max: 40 })) {
    errors.title = "Title Must be between 6 and 40 Characters";
  }

  if (!validator.isLength(data.description, { min: 30, max: 3000 })) {
    errors.description = "Description must be between 30 to 3000 Characters";
  }

  if (validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
