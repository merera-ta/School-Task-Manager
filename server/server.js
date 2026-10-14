const connectDB = require("./taskRoutes");

const express = require("express");

const Task = require("./models/Task");

const app = express();
app.use(express.json());
const PORT = 5000;

// Root route
app.get("/", (req, res) => {
  res.send("School Task Manager API is running!");
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

/// Create a new task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "A valid task title is required",
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title: title.trim(),
    completed: false,
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask,
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
