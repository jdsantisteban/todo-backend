const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");

// CREATE todo
router.post("/", auth, async (req, res) => {
  try {
    const newTodo = new Todo({
      user: req.user,
      text: req.body.text,
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: `Server error` });
  }
});

// GET all todos for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user });
    res.json(todos);
  } catch (error) {
    console.error();
    res.status(500).json({ msg: `Server error` });
  }
});

// UPDATE todo
router.put("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { $set: { text: req.body.text, completed: req.body.completed } },
      { new: true }
    );
    if (!todo) return res.status(404).json({ msg: `Todo not found` });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE todo
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });
    if (!todo) return res.status(404).json({ msg: "Todo not found" });
    res.json({ msg: `Todo deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: `Server error` });
  }
});

module.exports = router;
