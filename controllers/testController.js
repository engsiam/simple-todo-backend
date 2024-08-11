const Test = require("../models/testModel");

const testController = async (req, res) => {
  try {
    const { name, email } = req.body;
    let test = new Test({
      name: name,
      email: email,
    });

    test = await test.save();
    return res.status(200).send({
      message: "Blog post created successfully",
      name,
      email,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating blog post", error: error.message });
  }
};

module.exports = testController;