const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Show all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.render("index", { tasks });
});

// Show form to create new task
router.get("/new", (req, res) => {
  res.render("add-task");
});

// Create new task
router.post("/", async (req, res) => {
  await Task.create({ title: req.body.title });
  res.redirect("/tasks");
});

// Mark task as completed
router.put("/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { completed: true });
  res.redirect("/tasks");
});

// Delete a task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/tasks");
});

module.exports = router;
