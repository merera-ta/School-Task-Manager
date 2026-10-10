const express = require("express");

const app = express();
app.use(express.json());
const PORT = 5000;

// Temporary task data
const tasks = [
  {
    id: 1,
    title: "Learn Express",
    completed: false,
  },
  {
    id: 2,
    title: "Understand REST APIs",
    completed: false,
  },
  {
    id: 3,
    title: "Connect MongoDB",
    completed: false,
  },
];

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
