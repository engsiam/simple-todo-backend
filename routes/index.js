const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.get("/", (req, res) => {
  res.send("hello world");
});

router.post("/testPost",testController)

module.exports = router;
