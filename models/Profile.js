const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  workRequests: {
    type: Schema.Types.ObjectId,
    ref: "WorkRequest"
  },
  works: {
    type: Schema.Types.ObjectId,
    ref: "Work"
  },
  contactNo: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  country: {
    type: String
  },
  subscriptionStatus: {
    type: Number,
    default: 0
  },
  subscriptionStart: {
    type: Date,
    default: null
  }
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
