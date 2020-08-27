const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const WorkRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true,
    max: 40
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: Number
    /**
     * ? 0 For Pending
     * ? 1 For Approve
     * ? 2 For Complete
     * ? 3 For Reject
     */
  },
  chats: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      roleId: {
        type: Number
        /**
         * ? 0 Normal
         * ? 1 Admin
         */
      },
      docs: {
        fileName: {
          type: String
        },
        fileObject: {
          type: Object
        }
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  offerSent: {
    type: Boolean,
    default: false
  },
  offerAmount: {
    type: String,
    default: null
  },
  offerSentBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    default: null
  },
  deliveryTime: {
    type: Number,
    default: null
  },
  delivery_on: {
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
  }
});

module.exports = WorkRequest = mongoose.model(
  "workRequests",
  WorkRequestSchema
);
