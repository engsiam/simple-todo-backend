const Todo = require("../models/todoModel");
const fs = require("fs");
const mongoose = require("mongoose");

// Create a new Todo
exports.create = async (req, res) => {
  try {
    const { title, image, description,createdBy } = req.body;
    let todo = new Todo({
      title: title,
      image: req.file ? req.file.path : image,
      description: description,
      createdBy: createdBy,
    });
    await todo.save();
    return res.status(201).send({
      message: "Todo created successfully",
      title,
      image: req.file ? req.file.path : image,
      description,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating todo", error: error.message });
  }
};

// Get all Todos
exports.findAll = async (req, res) => {
  try {
    const allTodo = await Todo.find({}).populate("createdBy");

    res.status(200).send({
      message: "All Todos fetched successfully",
      allTodo: allTodo,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed finding All Todo", error: error.message });
  }
};

// Get a single Todo by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Todo Not Found" });
    }
    const singleTodo = await Todo.findById(id);
    res.status(200).send({
      message: "Todo fetched successfully",
      singleTodo: singleTodo,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to find todo", error: error.message });
  }
};

// Update a Todo by ID
exports.update = async (req, res) => {
  try {
    const { title, image, description, createdBy } = req.body;
    let todoId = req.params.id;
    let todoUpdate = await Todo.findById(todoId);
    if (!todoUpdate) {
      return res.status(404).send({ message: "Todo Not Found" });
    }
    //update todos by id
    todoUpdate.title = title || todoUpdate.title;
    todoUpdate.description = description || todoUpdate.description;
    todoUpdate.createdBy = createdBy || todoUpdate.createdBy;

    if (req.file) {
      todoUpdate.image = req.file.path;
    }

    await todoUpdate.save();
    return res.status(200).send({
      message: "Todo updated successfully",
      todoUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Update data failed", error: error.message });
  }
};

// Delete a Todo by ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = await Todo.findOneAndDelete({ _id: id });

    if (!deleteTodo) {
      return res.status(400).send({ message: "Todo Not Found" });
    }
    // Delete the associated image file if it exists
    if (deleteTodo.image) {
      try {
        fs.unlinkSync(deleteTodo.image);
      } catch (error) {
        return res
          .status(500)
          .send({ message: "Failed to delete image file", error: err.message });
      }
    }
    res.status(200).send({
      message: "Todo deleted successfully",
      deleteTodo,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Delete data failed", error: error.message });
  }
};
