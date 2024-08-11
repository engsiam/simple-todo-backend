// dbconnection.js
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const dbConnection = () => {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.error("Database connection error:", error);
      throw new Error('Failed to connect to MongoDB');
    });
};

module.exports = dbConnection;
