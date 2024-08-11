const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("user", userModel);
