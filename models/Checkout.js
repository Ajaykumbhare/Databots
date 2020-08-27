const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create User Schema

const CheckOutSchema = new Schema({
  paymentId: {
    type: String,
    required: true
  },
  payerInfo: {
    type: Object,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  cart: {
    type: String,
    required: true
  },
  create_time: {
    type: String,
    required: true
  },
  work: {
    type: Schema.Types.ObjectId,
    ref: "Work"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
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

module.exports = CheckOut = mongoose.model("checkouts", CheckOutSchema);
