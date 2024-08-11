const mongoose = require("mongoose");
const User = require("./userModel");
const { Schema } = mongoose;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
