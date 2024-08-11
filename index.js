const express = require("express");
const dbConnection = require("./helper/dbconnection");
const app = express();
const path = require("path");
const upload = require("./helper/imageUpload");
// Import routes
const indexRoutes = require("./routes/index");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");




//database connection
dbConnection();
//middleware
app.use(express.json());
//image upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//console.log("database", process.env.MONGODB_URI);
console.log("database", process.env.MONGODB_URI);

// Use routes
app.use("/api/v1", indexRoutes);
app.use("/api/v1/todos", upload.single("avatar"), todoRoutes);
app.use("/api/v1/user", userRoutes);

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
