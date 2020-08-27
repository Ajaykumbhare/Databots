const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roleId: {
    type: Number,
    default: 0
    /**
     * ? 0 Normal
     * ? 1 Admin
     */
  },
  status: {
    type: Number,
    default: 0
    /**
     * ? 0 Not Active
     * ? 1 Active
     * ? 2 Deleted
     */
  },
  profileStatusToken: {
    type: String
  },
  profileStatusExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  contactNo: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  country: {
    type: String,
    default: null
  },
  subscriptionStatus: {
    type: Number,
    default: 0
  },
  subscriptionStart: {
    type: Date,
    default: null
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: null
  },
  deleted_on: {
    type: Date,
    default: null
  },
  workRequests: {
    type: Schema.Types.ObjectId,
    ref: "WorkRequest"
  },
  works: {
    type: Schema.Types.ObjectId,
    ref: "Work"
  }
});

module.exports = User = mongoose.model("users", UserSchema);
