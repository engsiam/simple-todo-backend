const bcrypt = require("bcrypt");
const User = require("../models/registerModel");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, phone, username } = req.body;

  // Email regex pattern
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  // Password pattern: 1-9 number and uppercase and lowercase mixed
  const passwordPattern =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if (!name) {
    return res.status(400).send({ message: "Name is required" });
  }
  if (!email.match(emailPattern)) {
    return res
      .status(400)
      .send({ message: "Please provide a valid email address." });
  }
  if (!password.match(passwordPattern)) {
    return res.status(400).send({ message: "Please provide a valid password" });
  }
if(!username){
  return res.status(400).send({ message: "Username is required" });
}
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      phone,

    });
    await user.save();

    return res.status(201).send({
      message: "User created successfully",
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating user", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).send({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { _id: existingUser._id, email: existingUser.email, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).send({
      message: "User logged in successfully",
      token,
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone,
      username: existingUser.username,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
