const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const Work = new Schema({
  workId: {
    type: Schema.Types.ObjectId,
    ref: "WorkRequest"
  },
  amount: {
    type: Number,
    required: true
  },
  timeline: {
    type: Number,
    required: true
  },
  docs: {
    type: Object
  },
  status: {
    type: Number
    /**
     * ? 0 For Pending
     * ? 1 For Approve
     * ? 2 For Reject
     */
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
  }
});

module.exports = Work = mongoose.model("works", Work);
